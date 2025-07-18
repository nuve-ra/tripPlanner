import { pgTable, text, serial, integer, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const tripPlans = pgTable("trip_plans", {
  id: serial("id").primaryKey(),
  tripName: text("trip_name").notNull(),
  budget: text("budget"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  travelers: integer("travelers").notNull(),
  departureCity: text("departure_city").notNull(),
  destinationCity: text("destination_city").notNull(),
  travelClass: text("travel_class").notNull(),
  preferredAirline: text("preferred_airline"),
  stops: text("stops").notNull(),
  accommodationType: text("accommodation_type").notNull(),
  starRating: text("star_rating").notNull(),
  roomType: text("room_type").notNull(),
  checkinDate: text("checkin_date").notNull(),
  nights: integer("nights").notNull(),
  activityCategories: json("activity_categories").default([]),
  activityBudget: text("activity_budget").notNull(),
  specialRequests: text("special_requests"),
  travelInsurance: text("travel_insurance").notNull(),
  dietaryRestrictions: text("dietary_restrictions"),
  status: text("status").default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
});


export const insertTripPlanSchema = createInsertSchema(tripPlans, {
  activityCategories: z.array(z.string()),
}).omit({
  id: true,
  createdAt: true,
});

export const updateTripPlanSchema = insertTripPlanSchema.partial();

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type TripPlan = typeof tripPlans.$inferSelect;
export type InsertTripPlan = z.infer<typeof insertTripPlanSchema>;
export type UpdateTripPlan = z.infer<typeof updateTripPlanSchema>;
