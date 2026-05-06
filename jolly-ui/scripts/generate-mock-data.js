import { faker } from "@faker-js/faker";
import fs from "fs";

const generateMockFields = (count) => {
  const types = ["text", "number", "boolean", "select"];

  return Array.from({ length: count }, () => {
    const type = faker.helpers.arrayElement(types);
    const label = faker.commerce.productName() + " " + faker.string.alphanumeric(3);
    return {
      id: faker.string.uuid(),
      label,
      name: faker.helpers.slugify(label).toLowerCase(),
      type,
      validation: {
        required: faker.datatype.boolean(),
        min: type === "number" ? faker.number.int({ min: 0, max: 10 }) : undefined,
        max: type === "number" ? faker.number.int({ min: 50, max: 100 }) : undefined,
      },
      config: {
        placeholder: faker.lorem.sentence(3),
        options:
          type === "select"
            ? [faker.word.noun(), faker.word.noun(), faker.word.noun()]
            : undefined,
      },
      logic: {},
      status: faker.helpers.arrayElement(["active", "inactive"]),
      usageCount: faker.number.int({ min: 0, max: 500 }),
    };
  });
};

const data = generateMockFields(1000);
fs.writeFileSync("./public/mock-fields.json", JSON.stringify(data, null, 2));
console.log("Mock data generated successfully!");
