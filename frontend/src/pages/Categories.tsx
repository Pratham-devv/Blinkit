import { useProd } from "../context/hooks/Products.Hook";

const Categories = () => {
  const {products} = useProd();
  const categories = products.map(product => product.category).filter((value, index, self) => self.indexOf(value) === index);
  return (
    <div>
      Categories
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <div key={index} className="border flex justify-center items-center p-4">{category}</div>
        ))}
      </div>
    </div>
  )
}

export default Categories;
