import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage";


function App() {
  const [isAuth, setIsAuth] = useState(false)
  //使用者未登入是使用者未登入是false狀態，登入成功就是ture狀態，就可以渲染產品畫面

  return (
    <>
      {/*產品列表*/}
      {isAuth ? <ProductPage setIsAuth={setIsAuth}  /> 
      : <LoginPage  setIsAuth={setIsAuth} />}  
    </>
  )
}

export default App


