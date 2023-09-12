bun test v1.0.0 (822a00c4)
[0.03ms] ".env"

src/classes/system-data.spec.ts:
[0m[32m(pass)[0m selectAny() [5.83ms]
[0m[32m(pass)[0m selectAny() using filter ID [5.24ms]
[0m[32m(pass)[0m selectAny() using limit of 1 [2.18ms]
[0m[32m(pass)[0m selectAny() using limit of 0 [1.79ms]
[0m[32m(pass)[0m selectAll() with empty sources gives empty results [1.80ms]
[0m[32m(pass)[0m selectAll() with valid source IDs [2.23ms]
[0m[32m(pass)[0m selectAll() with duplicate source IDs [2.04ms]
[0m[32m(pass)[0m selectAll() with invalid source IDs [3.64ms]
[0m[32m(pass)[0m selectOne() with empty source gives empty result [1.89ms]
[0m[32m(pass)[0m selectOne() with valid source [1.85ms]
[0m[32m(pass)[0m selectOne() with invalid source ID [1.73ms]
[0m[32m(pass)[0m selectIds() with empty IDs gives empty results [1.53ms]
[0m[32m(pass)[0m selectIds() with valid IDs [1.88ms]
[0m[32m(pass)[0m selectIds() with duplicate IDs [1.72ms]
[0m[32m(pass)[0m selectIds() with invalid IDs [2.12ms]
[0m[32m(pass)[0m select404() with null ID should fail !! [1.80ms]
[0m[32m(pass)[0m select404() with valid ID [3.19ms]
[0m[32m(pass)[0m select404() with invalid ID should fail !! [1.33ms]
[0m[32m(pass)[0m createAll() with sources [2.88ms]
[0m[32m(pass)[0m createAll() with an empty array [0.45ms]
[0m[32m(pass)[0m createAll() with a single source [1.34ms]
[0m[32m(pass)[0m createAll() with a single source and an ID should fail !! [0.76ms]
[0m[32m(pass)[0m createAll() missing required data should fail !! [1.91ms]
[0m[32m(pass)[0m createAll() with unknown columns should fail !! [1.68ms]
[0m[32m(pass)[0m createOne() with source data [1.30ms]
[0m[32m(pass)[0m createOne() with an existing ID should fail !! [0.65ms]
[0m[32m(pass)[0m createOne() missing required data should fail !! [1.27ms]
[0m[32m(pass)[0m createOne() with unknown columns should fail !! [0.47ms]
[0m[32m(pass)[0m updateAll() with sources [8.69ms]
[0m[32m(pass)[0m updateAll() with an empty array [0.29ms]
[0m[32m(pass)[0m updateAll() with a single source [5.05ms]
[0m[32m(pass)[0m updateOne() with sources [3.19ms]
[0m[32m(pass)[0m updateOne() with an empty object should fail !! [1.64ms]
[0m[32m(pass)[0m updateAny() with a valid filter and change data [5.75ms]
[0m[32m(pass)[0m updateIds() with valid IDs and change data [6.70ms]
[0m[32m(pass)[0m expireAll() with sources [3.00ms]
[0m[32m(pass)[0m expireAll() with an empty array [0.32ms]
[0m[32m(pass)[0m expireAll() with a single source [3.53ms]
[0m[32m(pass)[0m expireOne() with source data [2.22ms]
[0m[32m(pass)[0m expireAny() with source IDs [3.29ms]
[0m[32m(pass)[0m expireIds() with source IDs [5.24ms]
[0m[32m(pass)[0m deleteAll() with sources [4.50ms]
[0m[32m(pass)[0m deleteAll() with an empty array [0.26ms]
[0m[32m(pass)[0m deleteAll() with a single source [3.82ms]
[0m[32m(pass)[0m deleteOne() with source data [2.03ms]
[0m[32m(pass)[0m deleteAny() with source IDs [3.45ms]
[0m[32m(pass)[0m deleteIds() with source IDs [3.18ms]

src/classes/system.spec.ts:
[0m[32m(pass)[0m tx test: insert a user => should rollback [3.19ms]
[0m[32m(pass)[0m tx test: verify the user does not exist [1.60ms]

src/classes/system-meta.spec.ts:
[0m[33m(skip)[2m schema => database table lifecycle
[0m[33m(skip)[2m column => database table lifecycle

src/observers/system.schema/delete-tables.spec.ts:
[0m[32m(pass)[0m should delete a knex table [31.58ms]

src/observers/system.schema/create-tables.spec.ts:
[0m[32m(pass)[0m should create a knex table [22.19ms]

src/observers/system.record/knex-select.spec.ts:
[0m[32m(pass)[0m "where" empty search [2.25ms]
[0m[32m(pass)[0m "where" with 1 column [1.91ms]
[0m[32m(pass)[0m "where" with 3 columns [1.26ms]
[0m[32m(pass)[0m "where" with 3 columns where 1 is incorrect [2.85ms]
[0m[32m(pass)[0m "where" with 1 column using null [0.90ms]
[0m[32m(pass)[0m "where" with 1 column using $not and null [2.20ms]
[0m[32m(pass)[0m "where" with 1 column using $eq and null [1.02ms]
[0m[32m(pass)[0m "where" with 1 column using $eq [1.71ms]
[0m[32m(pass)[0m "where" with 1 column using $ne and null [1.91ms]
[0m[32m(pass)[0m "where" with 1 column using $ne [1.55ms]
[0m[32m(pass)[0m "where" with 1 column using $gt [1.61ms]
[0m[32m(pass)[0m "where" with 1 column using $gte [1.95ms]
[0m[32m(pass)[0m "where" with 1 column using $lt [1.88ms]
[0m[32m(pass)[0m "where" with 1 column using $lte [2.02ms]
[0m[32m(pass)[0m "where" with 1 column using $in [1.29ms]
[0m[32m(pass)[0m "where" with 1 column using $nin [1.38ms]
[0m[32m(pass)[0m "where" with 1 column using $find [3.66ms]
[0m[32m(pass)[0m "where" with $and [2.34ms]
[0m[32m(pass)[0m "where" with $or [2.24ms]
[0m[32m(pass)[0m "order" is empty [2.03ms]
[0m[32m(pass)[0m "order" has 1 column with sort $asc [2.48ms]
[0m[32m(pass)[0m "order" has multiple columns with mixed sort [3.79ms]
[0m[32m(pass)[0m "limit" is empty [1.87ms]
[0m[32m(pass)[0m "limit" is negative [0.94ms]
[0m[32m(pass)[0m "limit" is 0 [0.96ms]
[0m[32m(pass)[0m "limit" is 1 [1.13ms]
[0m[32m(pass)[0m "limit" is 100 [1.93ms]

src/observers/system.record/test-required.spec.ts:
[0m[32m(pass)[0m required column should throw an error [26.75ms]

src/observers/system.record/test-immutable.spec.ts:
[0m[32m(pass)[0m immutable column should throw an error [26.02ms]

src/observers/system.column/delete-columns.spec.ts:
[0m[32m(pass)[0m should create a knex column [6.95ms]

src/observers/system.column/create-columns.spec.ts:
[0m[32m(pass)[0m should create a knex column [3.26ms]

2 tests skipped:
[0m[33m(skip)[2m schema => database table lifecycle
[0m[33m(skip)[2m column => database table lifecycle
-------------------------------------------------|---------|---------|-------------------
File                                             | % Funcs | % Lines | Uncovered Line #s
-------------------------------------------------|---------|---------|-------------------
All files                                        |   84.49 |   83.29 |
 src/classes/autoinstall.ts                      |   80.00 |   24.04 | 11-151,248-264
 src/classes/column.ts                           |  100.00 |  100.00 | 
 src/classes/filter.ts                           |  100.00 |  100.00 | 
 src/classes/helpers.ts                          |    0.00 |   12.50 | 3-8
 src/classes/observer-flow.ts                    |   83.33 |   93.85 | 36-39
 src/classes/observer.ts                         |   63.16 |   58.14 | 16,20-31,35,39,43,75
 src/classes/record.ts                           |   55.56 |   80.91 | 133-144,148,152-155,159,163-164
 src/classes/schema-type.ts                      |  100.00 |  100.00 | 
 src/classes/schema.ts                           |   87.50 |   98.25 | 
 src/classes/system-auth.ts                      |   50.00 |   42.22 | 24-26,39-61
 src/classes/system-data.ts                      |   96.61 |   91.11 | 100-103,128-131
 src/classes/system-knex.ts                      |   65.00 |   70.65 | 68-78,96-103,112-119
 src/classes/system-meta.ts                      |   55.56 |   79.31 | 73-80,104-106,110-112,116-119
 src/classes/system.ts                           |   66.67 |   59.46 | 56-59,80-98,107,115,121,152-155
 src/layouts/column.ts                           |  100.00 |  100.00 | 
 src/layouts/filter.ts                           |  100.00 |  100.00 | 
 src/layouts/observer.ts                         |  100.00 |  100.00 | 
 src/layouts/system.ts                           |  100.00 |  100.00 | 
 src/observers/system.column/create-columns.ts   |   90.91 |   60.47 | 13,40,42-44,46-48,50-52,54-56,58-60
 src/observers/system.column/delete-columns.ts   |   90.91 |   95.83 | 
 src/observers/system.record/knex-create.ts      |   92.86 |   97.30 | 
 src/observers/system.record/knex-delete.ts      |   90.00 |   96.00 | 
 src/observers/system.record/knex-expire.ts      |   90.00 |   96.00 | 
 src/observers/system.record/knex-select.ts      |   94.12 |   91.10 | 15,80,113,131,135,148,154,174,178,186,207,228
 src/observers/system.record/knex-update.ts      |   93.75 |   96.55 | 
 src/observers/system.record/select-prev.ts      |   85.71 |   95.65 | 
 src/observers/system.record/test-immutable.ts   |   88.89 |   96.97 | 
 src/observers/system.record/test-maximum.ts     |   88.89 |   51.43 | 13,39-41,43-44,46-48,50-52,54-56,59-60
 src/observers/system.record/test-minimum.ts     |   88.89 |   51.43 | 14,40-42,44-45,47-49,51-53,55-57,60-61
 src/observers/system.record/test-required.ts    |   88.89 |   96.55 | 
 src/observers/system.schema/create-tables.ts    |   90.91 |   91.67 | 15
 src/observers/system.schema/delete-tables.ts    |   90.00 |   91.30 | 12
 src/observers/system.schema/test-schema-name.ts |   88.89 |   96.43 | 
 src/preloader/observers.ts                      |  100.00 |  100.00 | 
 src/setup-tests.ts                              |  100.00 |  100.00 | 
-------------------------------------------------|---------|---------|-------------------

 82 pass
 2 skip
 0 fail
Ran 84 tests across 10 files. [1.86s]
