create table users (
    id varchar(26) primary key,
    email text unique not null,
    pass text not null,
    status_acc varchar(50) not null default 'not_accepted',
    created_at timestamp default now(),
    updated_at timestamp default null
);

create table characters (
    id varchar(26) primary key,
    user_id varchar(26) not null,
    nickname varchar(100) not null,
    lvl int not null default 0,
    foreign key (user_id) references users(id)
);

create table groups (
    id serial primary key,
    name_chat varchar(100) not null,
    type_chat varchar(100) not null
);

create table group_user (
    id serial primary key,
    group_id int not null,
    user_id varchar(26) not null,
    foreign key (group_id) references groups(id),
    foreign key (user_id) references users(id)
);

create table messages (
    id varchar(36) primary key,
    sender_id varchar(26) not null,
    group_id int default null,
    reciver_id varchar(26) default null,
    type varchar(30) default 'general',
    message text not null,
    foreign key (group_id) references groups(id),
    foreign key (sender_id )references characters(id),
    foreign key (reciver_id) references characters(id)
);