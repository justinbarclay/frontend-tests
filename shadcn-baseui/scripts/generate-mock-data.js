import { faker } from "@faker-js/faker";
import fs from "fs";

const generateMockFields = (count) => {
  const types = ["text", "number", "boolean", "select"];

  return Array.from({ length: count }, () => {
    const type = faker.helpers.arrayElement(types);
    const label = faker.commerce.productName();
    return {
      id: faker.string.uuid(),
      label,
      name: faker.helpers.slugify(label).toLowerCase(),
      type,
      status: faker.helpers.arrayElement(["active", "inactive"]),
      usageCount: faker.number.int({ min: 0, max: 500 }),
      validation: {
        required: faker.datatype.boolean(),
        min: type === "number" ? faker.number.int({ min: 0, max: 100 }) : undefined,
        max: type === "number" ? faker.number.int({ min: 101, max: 1000 }) : undefined,
      },
      config: {
        placeholder: faker.lorem.sentence(),
        options:
          type === "select"
            ? [faker.word.adjective(), faker.word.adjective(), faker.word.adjective()]
            : undefined,
      },
    };
  });
};

const data = generateMockFields(1000);
fs.writeFileSync("./public/mock-fields.json", JSON.stringify(data, null, 2));
console.log("Mock data generated successfully!");
