# DATA SETUP

The data for the data science challenge is built off of a view in the data warehouse called [v1_ds_cc.entity_masterkey](https://github.com/CredSimple/challenge/blob/master/data_sci/wh_setup/deploy/entity_master_view.sql). It is just a big join of all of the primary source keys for the entities that Linkasaur has been able to match (minus columns that are not relevant to the data challenge). It looks like this:

```
id     |    npi     |            name_npi             | gender |   city_npi   | state_npi | dea_number |         name_dea          |  city_dea   | state_dea | linkasaur
-------+------------+---------------------------------+--------+--------------+-----------+------------+---------------------------+-------------+-----------+-----------
399470 | 1598958019 | DR. THOMAS ANDREW BOWMAN M.D.   | M      | LUBBOCK      | TX        | FB2594352  | BOWMAN, THOMAS, A., MD    | LUBBOCK     | TX        |    0.9819
220614 | 1659636439 | DR. REBECCA ROYCE-HICKEY D.O.   | F      | PHILADELPHIA | PA        | FR5231446  | ROYCE-HICKEY, REBECCA, M  | ALLENTOWN   | PA        |    0.9790
406192 | 1063652162 | DR. DESMOND ANTHONY JOLLY MD    | M      | SAN DIEGO    | CA        | FJ0761254  | JOLLY, DESMOND A          | CHULA VISTA | CA        |    0.9528
145108 | 1790994390 | DR. JOHN P. WHEELER MD          | M      | AMES         | IA        | FW2578409  | WHEELER, JOHN P., MD      | AMES        | IA        |    0.9830
52015  | 1477638385 | RUMMANA RAHMAN MD               | F      | BROOKLYN     | NY        | BR2602363  | RAHMAN, RUMMANA MD        | BROOKLYN    | NY        |    0.9619
257925 | 1154522365 | MALINA VARNER M.D.              | F      | HERSHEY      | PA        | FV2630300  | VARNER, MALINA, M, MD     | HERSHEY     | PA        |    0.9775
305441 | 1639274475 | DAVID SOLTANPOUR MD             | M      | BROOKLYN     | NY        | BS7734088  | SOLTANPOUR, DAVID MD      | BROOKLYN    | NY        |    0.9618
304495 | 1851471726 | INNA SERBIN MD                  | F      | NEW YORK     | NY        | AS2320808  | SERBIN  INNA MD           | NEW YORK    | NY        |    0.9899
381423 | 1710034632 | DR. DAVID BRIAN GOLDENBERG M.D. | M      | NEW YORK     | NY        | BG4056912  | GOLDENBERG, DAVID, B (MD) | NEW YORK    | NY        |    0.9738
337634 | 1093198475 | ROHIT GUPTA D.O.                | M      | NEW YORK     | NY        | FG3070050  | GUPTA, ROHIT              | WEBSTER     | NY        |    0.9542
```

The idea is to grab two sets from this table - one with the joins intact so the candidate has training data to build a model, and a second validation set where we will remove the join and see what the candidate will be able to match. After the candidate submits their work we will be able to evaluate the performance of their model by matching back to the table above.

First we need to make to split this data into nice even buckets (or cohorts) to make sure that we aren't putting the same practitioner data in both the training and validation data sets we give to the candidate. We also need to hash the NPI and DEA numbers to mask that data from the candidate, and make sure that we aren't giving them data for providers we already have in CredSimple.

## Setting up cohorts
Use the % modulo operator on the id column from `v1_ds_cc.entity_masterkey`. `id % 20` effectively splits the entities into 20 cohorts of roughly equal size. This was you can make sure that your entities are always in the same buckets as you split the data into NPI and DEA files.

## Training data
One of the "tricks" used in this code challenge is to give the candidate a DEA dataset that is larger than the NPI dataset.

The candidate is given NPI/DEA training data sets from [cohorts 1 and 2](https://github.com/CredSimple/challenge/blob/master/data_sci/npi_dea_link_challenge/sql/training_set_1.sql#L9) to build their model.

Their task is to find DEA matches for the NPIs of cohorts we put in the validation data sets.

## Validation (Testing) data
NPIs are given for [cohorts 3, 4, 5, 6, and 7](https://github.com/CredSimple/challenge/blob/master/data_sci/npi_dea_link_challenge/sql/validation_set_1.sql#L9).
DEAs are given for [cohorts 4, 5, 6, 7, 8, and 9](https://github.com/CredSimple/challenge/blob/master/data_sci/npi_dea_link_challenge/sql/validation_set_2.sql#L9).
The effect is to really push the model they develop, because they will trying to match NPIs to a DEA dataset which 1) does not have corresponding DEAs for cohort 3 to test the model's performance on true negatives 2) has DEAs from cohorts 8 and 9 to test the model's perfomance on avoiding false positives. This is kind of a mean wrench to throw because this means any DEAs that are matched to NPIs for cohort 3 are garaunteed to be wrong.   

## Inspecting cohorts:

[estimate.sql](https://github.com/CredSimple/challenge/blob/master/data_sci/npi_dea_link_challenge/sql/estimate.sql)

The easiest cases to match will be those where the name fields on the NPI and DEA are very close (around ~80% of all entities) and where the address for the practitioner on the NPI and DEA are in the same city and state (around ~60%). This is the low hanging fruit... we'll be most interest in how well the model performs outside of those conditions (e.g., weird name variations and addresses in different cities or states).

```
 cohort | gender_npi | city_state_match | state_match_only | no_match | low_score_match | is_cs_provider | total
--------+------------+------------------+------------------+----------+-----------------+----------------+-------
      0 | F          |             0.58 |             0.36 |     0.06 |            0.19 |           0.52 |  1114
      0 | M          |             0.59 |             0.33 |     0.08 |            0.21 |           0.59 |  2005
      1 | F          |             0.56 |             0.35 |     0.09 |            0.19 |           0.54 |  1135
      1 | M          |             0.60 |             0.31 |     0.09 |            0.21 |           0.59 |  1871
      2 | F          |             0.57 |             0.36 |     0.07 |            0.17 |           0.53 |  1161
      2 | M          |             0.59 |             0.33 |     0.08 |            0.21 |           0.62 |  1917
      3 | F          |             0.56 |             0.37 |     0.08 |            0.19 |           0.55 |  1049
      3 | M          |             0.60 |             0.32 |     0.08 |            0.21 |           0.60 |  1913
      4 | F          |             0.58 |             0.34 |     0.08 |            0.19 |           0.57 |  1103
      4 | M          |             0.57 |             0.34 |     0.09 |            0.19 |           0.56 |  1998
      5 | F          |             0.57 |             0.35 |     0.08 |            0.19 |           0.57 |  1091
      5 | M          |             0.58 |             0.33 |     0.09 |            0.21 |           0.61 |  1900
      6 | F          |             0.55 |             0.37 |     0.09 |            0.17 |           0.56 |  1050
      6 | M          |             0.60 |             0.32 |     0.08 |            0.21 |           0.59 |  1949
      7 | F          |             0.57 |             0.35 |     0.08 |            0.19 |           0.53 |  1096
      7 | M          |             0.59 |             0.32 |     0.08 |            0.20 |           0.59 |  1927
      8 | F          |             0.57 |             0.35 |     0.08 |            0.22 |           0.57 |  1088
      8 | M          |             0.60 |             0.33 |     0.07 |            0.20 |           0.59 |  1963
      9 | F          |             0.59 |             0.34 |     0.07 |            0.18 |           0.54 |  1127
      9 | M          |             0.58 |             0.34 |     0.08 |            0.22 |           0.62 |  1872
     10 | F          |             0.58 |             0.34 |     0.09 |            0.19 |           0.54 |  1125
     10 | M          |             0.59 |             0.32 |     0.08 |            0.22 |           0.60 |  1901
     11 | F          |             0.56 |             0.36 |     0.08 |            0.16 |           0.54 |  1075
     11 | M          |             0.59 |             0.33 |     0.08 |            0.20 |           0.61 |  1936
     12 | F          |             0.54 |             0.38 |     0.08 |            0.21 |           0.54 |  1097
     12 | M          |             0.58 |             0.32 |     0.09 |            0.20 |           0.61 |  1856
     13 | F          |             0.59 |             0.32 |     0.09 |            0.20 |           0.56 |  1092
     13 | M          |             0.59 |             0.32 |     0.08 |            0.22 |           0.58 |  1918
     14 | F          |             0.56 |             0.35 |     0.09 |            0.19 |           0.53 |  1114
     14 | M          |             0.58 |             0.33 |     0.08 |            0.22 |           0.61 |  1949
     15 | F          |             0.56 |             0.34 |     0.10 |            0.20 |           0.54 |  1133
     15 | M          |             0.61 |             0.32 |     0.07 |            0.22 |           0.59 |  1936
     16 | F          |             0.57 |             0.35 |     0.08 |            0.19 |           0.56 |  1074
     16 | M          |             0.59 |             0.33 |     0.08 |            0.21 |           0.59 |  2008
     17 | F          |             0.59 |             0.34 |     0.07 |            0.18 |           0.55 |  1073
     17 | M          |             0.58 |             0.33 |     0.09 |            0.20 |           0.59 |  2011
     18 | F          |             0.57 |             0.34 |     0.08 |            0.21 |           0.56 |  1108
     18 | M          |             0.58 |             0.33 |     0.09 |            0.21 |           0.60 |  1853
     19 | F          |             0.57 |             0.36 |     0.07 |            0.19 |           0.55 |  1078
     19 | M          |             0.61 |             0.31 |     0.08 |            0.21 |           0.61 |  1970
```

## Formatting and masking NPI data:

[training_set_1.sql](https://github.com/CredSimple/challenge/blob/master/data_sci/npi_dea_link_challenge/sql/training_set_1.sql)

```
         practitioner_id          |                 full_name                  |          city          | state | gender
----------------------------------+--------------------------------------------+------------------------+-------+--------
 739a73315c5110b70fcb781023f509f2 | NATALIA A. KRUEGER MD                      | BIRDSBORO              | PA    | F
 3015939416bafac5e1ee65ed5b72abf8 | DR. PHUONG T. TIEN D.O.                    | WARMINSTER             | PA    | F
 3be57614267ce85671514352608d22b1 | JOANNE R. BLOOMSTEIN MD                    | WAUWATOSA              | WI    | F
 4f05f6a1854eceb216263d03d04d916c | JEAN DEMOPOULOS MD                         | MADISON                | WI    | F
 4a585fc9fceca222d4386a93735fad5b | SCOTT OELBERG D.O.                         | WAUKEE                 | IA    | M
 afae50ce9c170b77d1187c0e07df1e17 | DR. GABRIEL BUCURESCU MD                   | PHILADELPHIA           | PA    | M
 caa1fbf6d509be32a49d6ccd374a3615 | AMIT CHAUHAN MD                            | PARK FALLS             | WI    | M
 bacdcb36389d8148849d830fa0701d34 | DR. DENISE LEUNG MD                        | NEW YORK               | NY    | F
 ```

## Formatting and masking DEA data:

[training_set_2.sql](https://github.com/CredSimple/challenge/blob/master/data_sci/npi_dea_link_challenge/sql/training_set_2.sql)

```
         practitioner_id          |               full_name               |               city                | state | gender
----------------------------------+---------------------------------------+-----------------------------------+-------+--------
 8cbd7fd9e632e6cce702fcc1347b1eba | KRUEGER, NATALIA A., MD               | BIRDSBORO                         | PA    | F
 5c53e36df1a63e4e3ba06bb79d52851e | TIEN, PHUONG, T. DO                   | ABINGTON                          | PA    | F
 8b224f1de908b0a427013e148cc3ca17 | BLOOMSTEIN, JOANNE R                  | WAUWATOSA                         | WI    | F
 e6f938ebc9e8c897eee1b8aa26ea5dad | DEMOPOULOS, JEAN MD                   | MADISON                           | WI    | F
 8fcc7957d0af8895b145e8c4afb64eac | OELBERG, SCOTT, H., (D.O.)            | WAUKEE                            | IA    | M
 c6269439df850594294661c8465b148f | BUCURESCU, GABRIEL                    | PHILADELPHIA                      | PA    | M
 a6975558f9685059ba7df00b381a4b14 | CHAUHAN, AMIT                         | KENOSHA                           | WI    | M
 696b0f23e14325eb7936874fbb3594bc | LEUNG, DENISE MD                      | NEW YORK                          | NY    | F
 ```

## Mapping the NPI-DEA pairs:

[paired_keys.sql](https://github.com/CredSimple/challenge/blob/master/data_sci/npi_dea_link_challenge/sql/paired_keys.sql)

```
        practitioner_id_1         |        practitioner_id_2
----------------------------------+----------------------------------
 739a73315c5110b70fcb781023f509f2 | 8cbd7fd9e632e6cce702fcc1347b1eba
 3015939416bafac5e1ee65ed5b72abf8 | 5c53e36df1a63e4e3ba06bb79d52851e
 3be57614267ce85671514352608d22b1 | 8b224f1de908b0a427013e148cc3ca17
 4f05f6a1854eceb216263d03d04d916c | e6f938ebc9e8c897eee1b8aa26ea5dad
 4a585fc9fceca222d4386a93735fad5b | 8fcc7957d0af8895b145e8c4afb64eac
 afae50ce9c170b77d1187c0e07df1e17 | c6269439df850594294661c8465b148f
 caa1fbf6d509be32a49d6ccd374a3615 | a6975558f9685059ba7df00b381a4b14
 bacdcb36389d8148849d830fa0701d34 | 696b0f23e14325eb7936874fbb3594bc
 ```
## Submission
The candidate's submission should look like the mapping table above, with a third column containing a score between 0 and 1 of the strength of their match.
