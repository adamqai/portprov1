import { pgTable, serial, text, varchar, timestamp, integer, decimal, primaryKey } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
  email: varchar('email', { length: 256 }).unique(),
  password: varchar('password', { length: 256 }),
  role: text('role').default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const vessels = pgTable('vessels', {
  id: serial('id').primaryKey(),
  vesselName: varchar('vessel_name', { length: 256 }).notNull(),
  vesselType: varchar('vessel_type', { length: 256 }),
  imoNumber: varchar('imo_number', { length: 256 }).unique(),
  callSign: varchar('call_sign', { length: 256 }),
  flag: varchar('flag', { length: 256 }),
  grossTonnage: varchar('gross_tonnage', { length: 256 }),
  netTonnage: varchar('net_tonnage', { length: 256 }),
  length: decimal('length'),
  beam: decimal('beam'),
  draft: decimal('draft'),
  arrivalPort: varchar('arrival_port', { length: 256 }),
  berthId: integer('berth_id').references(() => berths.id),
  eta: timestamp('eta'),
  etd: timestamp('etd'),
  agent: varchar('agent', { length: 256 }),
  cargo: text('cargo'),
  cargoWeight: varchar('cargo_weight', { length: 256 }),
  iidNo: varchar('iid_no', { length: 256 }),
  consignee: varchar('consignee', { length: 256 }),
  remarks: text('remarks'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const berths = pgTable('berths', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull().unique(),
  status: varchar('status', { length: 50 }).default('available'), // e.g., available, occupied, maintenance
  maxDepth: decimal('max_depth'),
  maxLength: decimal('max_length'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const operations = pgTable('operations', {
  id: serial('id').primaryKey(),
  vesselId: integer('vessel_id').references(() => vessels.id),
  berthId: integer('berth_id').references(() => berths.id),
  operationType: varchar('operation_type', { length: 256 }), // e.g., loading, discharging, bunkering
  startTime: timestamp('start_time'),
  endTime: timestamp('end_time'),
  status: varchar('status', { length: 50 }).default('scheduled'), // e.g., scheduled, in-progress, completed, cancelled
  remarks: text('remarks'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});