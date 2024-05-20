import { query } from "."; // Adjust the import path to your actual db module

export const truncateTable = async (tableName: string): Promise<void> => {
  // La sentencia TRUNCATE TABLE es usada para borrar todos los registros de una tabla.
  // La sentencia RESTART IDENTITY sirve para que se borre la secuencia de la tabla y comience en uno
  // CASCADE opción que se asegura que cualquier referencia foranea tambien se borre.
  await query(`TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE`);
};
