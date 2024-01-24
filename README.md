# How to start the app

**copy `.env.example` to `.env`**

```bash
pnpm dev

```

## After updating prisma schema for mongodb

```sh
npx prisma generate
```

```sh
npx prisma db push
```

### After updating prisma schema for sql

```sh
npx prisma migrate dev --name <>
```


### TODO

- [ ] upload image
- [ ] upload video
- [ ] upload embed url
- [ ] text
