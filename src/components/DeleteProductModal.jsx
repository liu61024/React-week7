import axios from "axios";
import { useEffect, useRef } from "react";
import { Modal } from 'bootstrap';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;


function DeleteProductModal({isOpen, setIsOpen, getProducts, tempProduct}) {

    const deleteProductModalRef = useRef(null);
    //宣告刪除modal

   useEffect(() => {
           new Modal(deleteProductModalRef.current, {
               backdrop: false, //若不要點擊空白區域關閉modal 
           });
       }, [])
       //建立modal實例

     useEffect(() => {
            if (isOpen) {
                const modalInstance = Modal.getInstance(deleteProductModalRef.current);
                modalInstance.show();
            }
        }, [isOpen])
   
    const handleCloseDeleteProductModal = () => {
        const modalInstance = Modal.getInstance(deleteProductModalRef.current);
        modalInstance.hide();
        setIsOpen(false);
    }//關閉刪除modal

    const deleteProduct = async () => {
        try {
            await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`, {
                data: {
                    ...tempProduct,
                    origin_price: Number(tempProduct.origin_price), //轉字串
                    price: Number(tempProduct.price),
                    is_enabled: tempProduct.is_enabled ? 1 : 0 //是否啟用
                }
            })
        } catch (error) {
            alert("刪除產品失敗");
        }
    }

    const handleDeleteProduct = async () => {
        try {
            await deleteProduct(); //刪除產品
            getProducts();  //將產品放入list
            handleCloseDeleteProductModal(); //關閉刪除modal
        } catch (error) {
            alert("刪除產品失敗");
        }
    }

    return (
        <>
            <div
                ref={deleteProductModalRef}
                className="modal fade"
                id="delProductModal"
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">刪除產品</h1>
                            <button
                                onClick={handleCloseDeleteProductModal}
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            你是否要刪除
                            <span className="text-danger fw-bold">{tempProduct.title}</span>
                        </div>
                        <div className="modal-footer">
                            <button
                                onClick={handleCloseDeleteProductModal}
                                type="button"
                                className="btn btn-secondary"
                            >
                                取消
                            </button>
                            <button onClick={handleDeleteProduct} type="button" className="btn btn-danger">
                                刪除
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default DeleteProductModal