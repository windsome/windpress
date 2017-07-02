Changelog
=========
0.0.4
-------------
### Features
* database change.
alter table Users ADD wechat text DEFAULT NULL;
alter table Users ADD visited text DEFAULT NULL;
alter table Users ADD subscribe int(11) NOT NULL DEFAULT 0;
ALTER TABLE Users CHANGE `caps` `caps` text DEFAULT NULL;
ALTER TABLE Posts CHANGE `desc` `desc` text DEFAULT NULL;
ALTER TABLE Posts CHANGE `images` `images` text DEFAULT NULL;
### Improvements
* 

0.0.3
-------------
### Features
* database change.
alter table Orders ADD serial int(11) NOT NULL DEFAULT 0;
alter table Posts ADD paid int(11) NOT NULL DEFAULT 0;
alter table Posts ADD publish datetime NOT NULL DEFAULT 0;
update Users set caps='ROOT,POST_PUBLISH' where nicename='root'
### Improvements
* MyVoteOrders, MyLuckyOrders, See https://github.com/windsome/one for details and discussion.

0.0.2
-------------
### Features
* database change.
alter table Posts ADD random1 int(11) NOT NULL DEFAULT 0, ADD random2 varchar(255) NOT NULL DEFAULT '', ADD accomplish datetime NOT NULL;
### Improvements
* Change database for calculate lucky number of post.

0.0.1
-----
### Features
* Upgraded `eslint-plugin-react` to `^5.0.0`
* Upgraded `fs-extra` to `^0.28.0`

### Improvements
* Updated syntax used for `createStore` to match `redux@^3.1.0`
* Cleaned up `connect` decorator in `HomeView`
* Cleaned up flow types in `HomeView`

