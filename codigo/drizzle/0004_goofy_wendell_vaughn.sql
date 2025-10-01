CREATE TABLE "automovel" (
	"matricula" serial PRIMARY KEY NOT NULL,
	"ano" text NOT NULL,
	"modelo" text NOT NULL,
	"marca" text NOT NULL,
	"placa" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pedido" ADD COLUMN "cliente_id" integer;--> statement-breakpoint
ALTER TABLE "automovel" ADD CONSTRAINT "automovel_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pedido" ADD CONSTRAINT "pedido_cliente_id_cliente_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."cliente"("id") ON DELETE no action ON UPDATE no action;