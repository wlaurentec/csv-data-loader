// test/products.test.ts
import { describe, beforeEach, it, expect } from "vitest";
import request from "supertest";
import { app } from "../app"; // Import your Express app
import { truncateTable } from "../db/utils"; // Helper functions for database setup
import * as db from "../db";

const testProducts = [
  { name: "Product 1", price: 1000, category: "Food" },
  { name: "Product 2", price: 2000, category: "Electronics" },
];

describe("Products API", () => {
  // Por cada Test regresamos a un estado inicial
  beforeEach(async () => {
    // Limpia la tabla de productos
    await truncateTable("products");
    // Inserta los datos de prueba
    const values = testProducts
      .map(
        (product) =>
          `('${product.name}', ${product.price}, '${product.category}')`
      )
      .join(", ");
    // "('Product 1', 1000, 'Food'), ('Product 2', 2000, 'Electronics')"
    let query = `INSERT INTO products (name, price, category) VALUES ${values}`;

    await db.query(query);
  });

  it("should get all products", async () => {
    // await request(app)
    //   .get("/products")
    //   .expect("Content-Type", /json/)
    //   .expect(400);
    const response = await request(app).get("/products");
    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.data).toHaveLength(2);
  });

  it("should filters must work", async () => {
    //const response = await request(app).get("/products?category=Electronics");
    const response = await request(app)
      .get("/products")
      .query({ category: "Electronics" });
    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.data).toHaveLength(1);
  });

  it("should get a single product", async () => {
    const response = await request(app).get("/products/1");
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toMatchObject(testProducts[0]);
  });

  it("should get a 404 when getting a non-existent product", async () => {
    const response = await request(app).get("/products/999");
    expect(response.statusCode).toBe(404);
    expect(response.body.ok).toBeFalsy();
    expect(response.body.error).toBe("Product not found");
  });

  it("should create a product", async () => {
    const productData = {
      name: "Product 3",
      price: 3000,
      category: "Clothing",
    };
    let response = await request(app).post("/products").send(productData);
    expect(response.statusCode).toBe(201);
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toMatchObject(productData);
    // Opcionalmente podríamos hacer get a /products/:id
    const newId = response.body.data.id;
    response = await request(app).get(`/products/${newId}`);
    expect(response.statusCode).toBe(200);
  });

  it("should update a product", async () => {
    const updates = {
      name: "Product 1 Updated",
      price: 5000,
      category: "Cleaning",
    };

    const response = await request(app).patch("/products/1").send(updates);
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data.name).toBe(updates.name);
    expect(response.body.data).toMatchObject(updates);
    // Opcionalmente podríamos hacer get a /products/:id
  });

  it("should delete a product", async () => {
    const response = await request(app).delete("/products/1");
    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.data).toBeUndefined();
  });
});
