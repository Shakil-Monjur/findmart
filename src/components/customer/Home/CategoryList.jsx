const categories = [
  "All",
  "Grocery",
  "Medicine",
  "Bakery",
  "Electronics",
  "Restaurant",
];

function CategoryList() {
  return (
    <div className="categories">

      {categories.map((category) => (
        <button key={category}>
          {category}
        </button>
      ))}

    </div>
  );
}

export default CategoryList;