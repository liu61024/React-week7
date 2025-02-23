import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Modal } from 'bootstrap';
import { useDispatch } from "react-redux";
import { pushMessage } from "../Redux/toastSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductModal({ modalMode, tempProduct, isOpen, setIsOpen, getProducts}) {

    const [modalData, setModalData] = useState(tempProduct);
    //不讓tempProduct被modal影響，建立一個狀態


    useEffect(( ) =>{
        setModalData({
            ...tempProduct //讓ModalData再更新一次
        })
    }, [tempProduct])

    const productModalRef = useRef(null);
    //宣告modal

    useEffect(() => {
        new Modal(productModalRef.current, {
            backdrop: false, //若不要點擊空白區域關閉modal 
        });
    }, [])
    //建立modal實例


    useEffect(() => {
        if (isOpen) {
            const modalInstance = Modal.getInstance(productModalRef.current);
            modalInstance.show();
        }
    }, [isOpen])

    const dispatch = useDispatch();

    const handleCloseProductModal = () => {
        const modalInstance = Modal.getInstance(productModalRef.current);
        modalInstance.hide();
        setIsOpen(false);
    }//關閉modal

    const handleModalInputChange = (e) => {
        const { value, name, checked, type } = e.target; //解構出解構出e.target裡面
        setModalData({
            ...modalData,
            [name]: type === "checkbox" ? checked : value //對應name修改欄位的值是checked或value
        });
    }

    const handleImageChange = (e, index) => { //index是為了判斷第幾張圖
        const { value } = e.target; //解構出解構出e.target裡面
        const newImages = [...modalData.imagesUrl]; //設一個新陣列
        newImages[index] = value; //透過index更改對應欄位
        setModalData({ //傳入圖片網址
            ...modalData,
            imagesUrl: newImages
        });
    }

    const handleAddImage = () => {
        const newImages = [...modalData.imagesUrl, ""]; //設一個新陣列後加入空字串
        setModalData({ //傳入圖片網址
            ...modalData,
            imagesUrl: newImages
        });
    }

    const handleCancelImage = () => {
        const newImages = [...modalData.imagesUrl]; //設一個新陣列
        newImages.pop(); //陣列最後一個值刪除
        setModalData({ //傳入圖片網址
            ...modalData,
            imagesUrl: newImages
        });
    }

    const createProduct = async () => {
        try {
            await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/product`, {
                data: {
                    ...modalData,
                    origin_price: Number(modalData.origin_price), //轉字串
                    price: Number(modalData.price),
                    is_enabled: modalData.is_enabled ? 1 : 0 //是否啟用
                }               
            });
            dispatch(pushMessage({                
                text : "新增成功", 
                status : 'success'             
            }))
        } catch (error) {
            //alert("新增產品失敗，請填入必填資料");
            const {message} = error.response.data;
            dispatch(pushMessage({                
                text : message.join("、"), 
                status : 'failed'             
            }))
        }
    }

    const editProduct = async () => {
        try {
            await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${modalData.id}`, {
                data: {
                    ...modalData,
                    origin_price: Number(modalData.origin_price), //轉字串
                    price: Number(modalData.price),
                    is_enabled: modalData.is_enabled ? 1 : 0 //是否啟用
                }
            })
        } catch (error) {
            alert("編輯產品失敗，請填入必填資料");

        }
    }

    const handleUpdateProduct = async () => {
        const apiCall = modalMode === "create" ? createProduct : editProduct; //判斷新增或是編輯
        try {
            await apiCall(); //呼叫新增或是編輯
            getProducts(); //將產品放入list
            handleCloseProductModal(); //關閉modal
        } catch (error) {
            alert("更新產品失敗");
        }
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file-to-upload", file);
        try {
            const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/upload`, formData);
            const uploadImageUrl = res.data.imageUrl;
            setModalData({
                ...modalData,
                imageUrl: uploadImageUrl
            })
        } catch (error) {
            alert("上傳圖片失敗");
        }
    }


    return (
        <>
            <div ref={productModalRef} id="productModal" className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content border-0 shadow">
                        <div className="modal-header border-bottom">
                            <h5 className="modal-title fs-4">{modalMode === "create" ? "新增產品" : "編輯產品"}</h5>
                            <button type="button" onClick={handleCloseProductModal} className="btn-close" aria-label="Close"></button>
                        </div>

                        <div className="modal-body p-4">
                            <div className="row g-4">
                                <div className="col-md-4">
                                    {/*圖片上傳*/}
                                    <div className="mb-5">
                                        <label htmlFor="fileInput" className="form-label"> 圖片上傳 </label>
                                        <input
                                            type="file"
                                            accept=".jpg,.jpeg,.png"
                                            className="form-control"
                                            id="fileInput"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="primary-image" className="form-label">
                                            主圖
                                        </label>
                                        <div className="input-group">

                                            <input
                                                value={modalData.imageUrl}
                                                onChange={handleModalInputChange}
                                                name="imageUrl"
                                                type="text"
                                                id="primary-image"
                                                className="form-control"
                                                placeholder="請輸入圖片連結"
                                            />
                                        </div>

                                        <img src={modalData.imageUrl}
                                            alt={modalData.title}
                                            className="img-fluid"
                                        />
                                    </div>

                                    {/* 副圖 */}
                                    <div className="border border-2 border-dashed rounded-3 p-3">
                                        {modalData.imagesUrl?.map((image, index) => (
                                            <div key={index} className="mb-2">
                                                <label
                                                    htmlFor={`imagesUrl-${index + 1}`}
                                                    className="form-label"
                                                >
                                                    副圖 {index + 1}
                                                </label>
                                                <input
                                                    value={image}
                                                    onChange={(e) => handleImageChange(e, index)} //index判斷第幾張圖
                                                    id={`imagesUrl-${index + 1}`}
                                                    type="text"
                                                    placeholder={`圖片網址 ${index + 1}`}
                                                    className="form-control mb-2"
                                                />
                                                {image && (
                                                    <img
                                                        src={image}
                                                        alt={`副圖 ${index + 1}`}
                                                        className="img-fluid mb-2"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                        <div className="btn-group w-100">
                                            {modalData.imagesUrl.length < 5 &&
                                                modalData.imagesUrl[modalData.imagesUrl.
                                                    length - 1] !== "" && (
                                                    <button onClick={handleAddImage} className="btn btn-outline-primary btn-sm w-100">新增圖片</button>
                                                )} {/* 小於5張圖，裡面又有值不等於空字串，可以加上新增按鈕 */}
                                            {modalData.imagesUrl.length > 1 && (
                                                <button onClick={handleCancelImage} className="btn btn-outline-danger btn-sm w-100">取消圖片</button>
                                            )} {/* 大於1張圖，可以加上取消按鈕 */}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-8">
                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label">
                                            標題
                                        </label>
                                        <input
                                            value={modalData.title} //
                                            onChange={handleModalInputChange} //
                                            name="title"
                                            id="title"
                                            type="text"
                                            className="form-control"
                                            placeholder="請輸入標題"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="category" className="form-label">
                                            分類
                                        </label>
                                        <input
                                            value={modalData.category} //
                                            onChange={handleModalInputChange} //
                                            name="category"
                                            id="category"
                                            type="text"
                                            className="form-control"
                                            placeholder="請輸入分類"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="unit" className="form-label">
                                            單位
                                        </label>
                                        <input
                                            value={modalData.unit} //
                                            onChange={handleModalInputChange} //
                                            name="unit"
                                            id="unit"
                                            type="text"
                                            className="form-control"
                                            placeholder="請輸入單位"
                                        />
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <label htmlFor="origin_price" className="form-label">
                                                原價
                                            </label>
                                            <input
                                                value={modalData.origin_price} //
                                                onChange={handleModalInputChange} //
                                                min="0"
                                                name="origin_price"
                                                id="origin_price"
                                                type="number"
                                                className="form-control"
                                                placeholder="請輸入原價"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="price" className="form-label">
                                                售價
                                            </label>
                                            <input
                                                value={modalData.price} //
                                                onChange={handleModalInputChange} //
                                                name="price"
                                                min="0"
                                                id="price"
                                                type="number"
                                                className="form-control"
                                                placeholder="請輸入售價"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">
                                            產品描述
                                        </label>
                                        <textarea
                                            value={modalData.description} //
                                            onChange={handleModalInputChange} //
                                            name="description"
                                            id="description"
                                            className="form-control"
                                            rows={4}
                                            placeholder="請輸入產品描述"
                                        ></textarea>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="content" className="form-label">
                                            說明內容
                                        </label>
                                        <textarea
                                            value={modalData.content} //
                                            onChange={handleModalInputChange} //
                                            name="content"
                                            id="content"
                                            className="form-control"
                                            rows={4}
                                            placeholder="請輸入說明內容"
                                        ></textarea>
                                    </div>

                                    <div className="form-check">
                                        <input
                                            checked={modalData.is_enabled} //
                                            onChange={handleModalInputChange} //
                                            name="is_enabled"
                                            type="checkbox"
                                            className="form-check-input"
                                            id="isEnabled"
                                        />
                                        <label className="form-check-label" htmlFor="isEnabled">
                                            是否啟用
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer border-top bg-light">
                            <button type="button" onClick={handleCloseProductModal} className="btn btn-secondary">
                                取消
                            </button>
                            <button type="button" onClick={handleUpdateProduct} className="btn btn-success">
                                確認
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )




}
export default ProductModal