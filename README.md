# How to start the app

**copy `.env.example` to `.env`**

```bash
pnpm dev

```

## Project Checklist - Shop Inventory Management App

1. **User Account Management:**
   - [x] Implement user registration with fields: Name, Phone Number, Email, Password.
   - [x] Implement user login using Email/Phone Number and Password combination.

2. **Shop Creation:**
   - [x] Allow logged-in users to create a shop with details: Name, Shop bio/about, Address, Latitude, and Longitude of the shop.

3. **Product Management:**
   - [x] Enable users to add products with attributes: Name, Description, Price, Tags, Available stock/inventory.
   - [x] Implement the ability to view a list of all products.
   - [x] Implement the ability to edit and delete added products.
   - [x] Allow users to change the available stock/inventory of each product separately and for each shop.

4. **User Roles:**
   - [x] Implement user roles: Admin and Manager.
   - [x] Admin should have the ability to add, edit and remove team members.
   - [x] Only Admins should be able to add more products.
   - [x] Managers cannot add more users or products; they can only change the available stock of products.

5. **Efficient Product List View:**
   - [x] Optimize the product list view to handle a large number of products efficiently through Pagination.

6. **Data Persistence:**
   - [x] Implement data persistence to ensure user data and added products persist between app sessions.
   - [x] Implement redux

7. **Security:**
   - [x] Implement secure authentication and authorization mechanisms to protect user accounts and data.

8. **User Experience:**
   - [x] Implement error handling and validation for user inputs.

### After updating prisma schema for mongodb

```sh
npx prisma db push
```

### After updating prisma schema for sql

```sh
npx prisma migrate dev --name <>
```
