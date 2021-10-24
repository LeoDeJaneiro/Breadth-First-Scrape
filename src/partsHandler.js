const url = "https://www.urparts.com/index.cfm/page/catalogue";

const applyPageStructure = (sectionClass) => `.${sectionClass} > ul > li > a`;
const leafIdentifier = ".allparts > ul > li > a";
const columnNames = [
  "manufacturer",
  "category",
  "model",
  "part",
  "part_category",
];

const getIdentifier = (url) => {
  const urlParts = url.split("/");
  let identifier;
  switch (urlParts.length) {
    case 6:
      identifier = "allmakes";
      break;
    case 7:
      identifier = "allcategories";
      break;
    case 8:
      identifier = "allmodels";
      break;
    default:
      identifier = "allparts";
      break;
  }
  return applyPageStructure(identifier);
};

const extractInfo = async (page, identifier, url) => {
  try {
    const parts = await page.$$eval(identifier, (domNode) =>
      domNode
        .map((el) => el.innerHTML)
        .map((innerHTML) => ({
          part: innerHTML.split(" - ")[0].trim(),
          part_category: innerHTML.split("<span>")[1],
        }))
    );
    const urlParts = url
      .split("/")
      .map((urlPart) => urlPart.replace(/%20/g, " "));
    const generalInfo = {
      manufacturer: urlParts[urlParts.length - 3],
      category: urlParts[urlParts.length - 2],
      model: urlParts[urlParts.length - 1],
    };
    return parts.map((part) => ({ ...part, ...generalInfo }));
  } catch (error) {
    console.error("extractInfo: ", error);
    return [];
  }
};

module.exports = {
  extractInfo,
  getIdentifier,
  leafIdentifier,
  columnNames,
  url,
};
