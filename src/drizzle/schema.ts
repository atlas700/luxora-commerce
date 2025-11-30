import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const id = uuid().primaryKey().defaultRandom();
const createdAt = timestamp({ withTimezone: true }).defaultNow();
const updatedAt = timestamp({ withTimezone: true })
  .defaultNow()
  .$onUpdate(() => new Date());

export const UserRole = pgEnum("user_role", ["USER", "ADMIN"]);
export const OrderStatus = pgEnum("order_status", [
  "PROCESSING",
  "SHIPPING",
  "DELIVERED",
]);
export type OrderStatusType = "PROCESSING" | "SHIPPING" | "DELIVERED";

export const UserTable = pgTable("users", {
  id: text().primaryKey(),
  name: varchar().notNull(),
  email: text().notNull().unique(),
  role: UserRole().notNull().default("USER"),
  imageUrl: text(),
  createdAt: createdAt,
  updatedAt: updatedAt,
});

export const UserRelations = relations(UserTable, ({ many }) => {
  return {
    products: many(ProductTable),
    orders: many(OrderTable),
    shippingAddresses: many(ShippingAddressTable),
  };
});

export const ProductTable = pgTable("products", {
  id: id,
  name: text().notNull(),
  description: text().notNull(),
  imageUrl: text().notNull(),
  imageKey: text().notNull(),
  userId: text()
    .notNull()
    .references(() => UserTable.id, { onDelete: "restrict" }),
  priceInCents: integer().notNull(),
  availableForPurchase: boolean().notNull().default(false),
  weight: text().notNull(),
  stockQty: integer().notNull().default(0),
  createdAt: createdAt,
  updatedAt: updatedAt,
});

export const ProductRelations = relations(ProductTable, ({ one, many }) => {
  return {
    user: one(UserTable, {
      fields: [ProductTable.userId],
      references: [UserTable.id],
    }),
    orders: many(OrderTable),
  };
});

export const OrderTable = pgTable("orders", {
  id: id,
  userId: text()
    .notNull()
    .references(() => UserTable.id, { onDelete: "restrict" }),
  productId: uuid()
    .notNull()
    .references(() => ProductTable.id, { onDelete: "restrict" }),
  shippingAddressId: uuid()
    .notNull()
    .references(() => ShippingAddressTable.id, { onDelete: "cascade" }),
  pricePaidInCents: integer().notNull(),
  paymentIntentId: text(),
  status: OrderStatus().default("PROCESSING"),
  createdAt: createdAt,
  updatedAt: updatedAt,
});

export const OrderRelations = relations(OrderTable, ({ one }) => {
  return {
    user: one(UserTable, {
      fields: [OrderTable.userId],
      references: [UserTable.id],
    }),
    product: one(ProductTable, {
      fields: [OrderTable.productId],
      references: [ProductTable.id],
    }),
    shippingAddress: one(ShippingAddressTable, {
      fields: [OrderTable.shippingAddressId],
      references: [ShippingAddressTable.id],
    }),
  };
});

export const ShippingAddressTable = pgTable("shipping_address", {
  id: id,
  userId: text()
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  country: varchar().notNull(),
  province: varchar().notNull(),
  city: varchar().notNull(),
  address: text().notNull(),
  phoneNumber: text().notNull(),
  createdAt: createdAt,
  updatedAt: updatedAt,
});

export const ShippingAddressRelations = relations(
  ShippingAddressTable,
  ({ one, many }) => {
    return {
      user: one(UserTable, {
        fields: [ShippingAddressTable.userId],
        references: [UserTable.id],
      }),
      orders: many(OrderTable),
    };
  }
);
