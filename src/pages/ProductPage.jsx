import axios from "axios";
import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import ProductModal from "../components/PruductModal";
import DeleteProductModal from "../components/DeleteProductModal";
import Toast from "../components/Toast";
import LoginPage from "./LoginPage";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalState = {
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [""]
};

function ProductPage() {

    const [products, setProducts] = useState([]);
    //這次要從API抓Products

    const [modalMode, setmodalMode] = useState(null);
    //宣告modal要開啟產品modal時帶入產品value

    const [isProductModalOpen, setisProductModalOpen] = useState(false);
    //宣告新的modal打開方式

    const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] = useState(false);
    //宣告新的刪除modal打開方式



    const getProducts = async (page = 1) => { //預設page是1
        try {
            const res = await axios.get(
                `${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}` //帶入page
            );
            setProducts(res.data.products);
            setpageInfo(res.data.pagination);
        } catch (error) {
            alert("取得產品失敗");
        }
    }; //取得產品

    useEffect(() => {
        getProducts();
    }, [])

    const handleOpenDeleteProductModal = (product) => {
        setTempProduct(product); //為了在刪除時帶入產品
        setIsDeleteProductModalOpen(true);
    }//打開刪除modal

    const [tempProduct, setTempProduct] = useState(defaultModalState);

    const handleOpenProductModal = (mode, product) => {
        setmodalMode(mode); //傳入mode參數
        switch (mode) { //判斷為新增還編輯
            case "create":
                setTempProduct(defaultModalState);
                break;
            case "edit":
                setTempProduct(product);
                break;
            default:
                break;
        }
        setisProductModalOpen(true);
    }//打開modal

    const [pageInfo, setpageInfo] = useState({});

    const handlePageChange = (page) => {
        getProducts(page);
    }//控制分頁

    const [isAuth, setIsAuth] = useState(true);


    const handleLogout = async () => { 
        try {
            await axios.post(`${BASE_URL}/v2/logout`);
            setIsAuth(false);
        } catch (error) {
            setIsAuth(false);
        }
    }; 

    if (!isAuth) {
        return <LoginPage getProducts={getProducts} setIsAuth={setIsAuth} />;
    }

    return (
        <>
            <div className="container py-5">
                <div className="row">
                    <div className="col">
                        <h2>產品列表</h2>
                        <div className="d-flex justify-content-between">
                            <button type="button" onClick={() => { handleOpenProductModal("create") }} className="btn btn-success">新增產品</button>
                            <button type="button" onClick={handleLogout} className="btn btn-outline-success">登出</button>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">產品名稱</th>
                                    <th scope="col">原價</th>
                                    <th scope="col">售價</th>
                                    <th scope="col">是否啟用</th>
                                    <th scope="col">編輯及刪除</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <th scope="row">{product.title}</th>
                                        <td>{product.origin_price}</td>
                                        <td>{product.price}</td>
                                        <td>{product.is_enabled ? <span className="text-success">啟用</span> : <span>未啟用</span>}</td>
                                        <td>
                                            <div className="btn-group">
                                                <button type="button" onClick={() => { handleOpenProductModal("edit", product) }} className="btn btn-success btn-sm">編輯</button>
                                                {/*在編輯按鈕帶入參數，帶入產品資料*/}
                                                <button onClick={() => handleOpenDeleteProductModal(product)} type="button" className="btn btn-danger btn-sm">刪除</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
            </div>
            <ProductModal
                modalMode={modalMode}
                tempProduct={tempProduct}
                isOpen={isProductModalOpen}
                setIsOpen={setisProductModalOpen}
                getProducts={getProducts} />
            <DeleteProductModal
                tempProduct={tempProduct}
                isOpen={isDeleteProductModalOpen}
                setIsOpen={setIsDeleteProductModalOpen}
                getProducts={getProducts} />

            <Toast />
        </>
    )
}
export default ProductPage