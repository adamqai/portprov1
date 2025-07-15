CREATE TABLE "berths" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"status" varchar(50) DEFAULT 'available',
	"max_depth" numeric,
	"max_length" numeric,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "berths_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "operations" (
	"id" serial PRIMARY KEY NOT NULL,
	"vessel_id" integer,
	"berth_id" integer,
	"operation_type" varchar(256),
	"start_time" timestamp,
	"end_time" timestamp,
	"status" varchar(50) DEFAULT 'scheduled',
	"remarks" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text,
	"phone" varchar(256),
	"email" varchar(256),
	"role" text DEFAULT 'user',
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vessels" (
	"id" serial PRIMARY KEY NOT NULL,
	"vessel_name" varchar(256) NOT NULL,
	"vessel_type" varchar(256),
	"imo_number" varchar(256),
	"call_sign" varchar(256),
	"flag" varchar(256),
	"gross_tonnage" varchar(256),
	"net_tonnage" varchar(256),
	"length" numeric,
	"beam" numeric,
	"draft" numeric,
	"arrival_port" varchar(256),
	"berth_id" integer,
	"eta" timestamp,
	"etd" timestamp,
	"agent" varchar(256),
	"cargo" text,
	"cargo_weight" varchar(256),
	"iid_no" varchar(256),
	"consignee" varchar(256),
	"remarks" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vessels_imo_number_unique" UNIQUE("imo_number")
);
--> statement-breakpoint
ALTER TABLE "operations" ADD CONSTRAINT "operations_vessel_id_vessels_id_fk" FOREIGN KEY ("vessel_id") REFERENCES "public"."vessels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operations" ADD CONSTRAINT "operations_berth_id_berths_id_fk" FOREIGN KEY ("berth_id") REFERENCES "public"."berths"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vessels" ADD CONSTRAINT "vessels_berth_id_berths_id_fk" FOREIGN KEY ("berth_id") REFERENCES "public"."berths"("id") ON DELETE no action ON UPDATE no action;