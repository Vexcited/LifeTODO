# LifeTODO

A small app to manage your life TODOs and publicly share them.

## Motivation

I know there's a lot of apps out there that do this, but I wanted to make my own to be able to full custom it.
The main reason here is that there's nothing else, it's just the todo list that appears in a certain
priority order and you can see if it's done or not. That's it.

## Features

### Authentication

- [x] Register
  - [x] Automatically assign writer (admin) role if first user in database
  - [x] Otherwise, assign default role (not writer)
- [x] Login
- [x] Logout
- [x] Check token validity

### TODOs

Most of these features are only available to writers.

- [x] Create
- [x] Mark as done
- [x] Edit title and description and save
- [ ] Move around
  - [x] State mutation
  - [ ] UI drag and drop

### Social

- [ ] Add a comment on a TODO

### Administration

- [x] List all users
- [ ] Assign roles (user or admin/writer)
- [ ] Delete users

### Account

- [x] Change display name
- [ ] Change password
- [ ] Delete account
