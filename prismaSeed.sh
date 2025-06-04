
## YOU CAN EITHER RUN THIS BASH SCRIPT OR FOLLOW THE LISTED STEPS
#!/bin/bash

# Run npm install to update dependencies
npm install

# Step 1: Add line to package.json  
#   "prisma": {
#       "seed": "ts-node prisma/seed.ts"
#  },
jq '.prisma.seed = "ts-node prisma/seed.ts"' package.json > temp.json && mv temp.json package.json

# Step 2: Install dependency
npm i -D ts-node

# Step 3: Edit previous line in package.json
#   "prisma": {
#       "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
#  },
jq '.prisma.seed = "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"' package.json > temp.json && mv temp.json package.json

# Repeat Step 2: Install dependency
npm i -D ts-node

# Step 4: Seed database
npx prisma db seed

# Step 5: View changes
npx prisma studio