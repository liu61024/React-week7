import axios from "axios";
import { useState , useEffect } from "react";


const BASE_URL = import.meta.env.VITE_BASE_URL;

function LoginPage({ getProducts ,setIsAuth }) {

  const [account, setAccount] = useState({
    username: "example@test.com",
    password: "example"
  })
  //宣告帳密

  const handleInputChange = (e) => { //綁定onChange
    const { value, name } = e.target; //value, name可以被解構出來
    setAccount({
      ...account, //展開
      [name]: value //可以把帳密的值帶入
    })
  } //帶入帳密

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post(`${BASE_URL}/v2/admin/signin`, account)
      .then((res) => {
        const { token, expired } = res.data;
        document.cookie = `myToken=${token}; expires = ${new Date(expired)}`;
        axios.defaults.headers.common['Authorization'] = token;
        setIsAuth(true);
      })
      .catch((err) => {
        alert("登入失敗~");
        console.log(err);
      })
  } //登入頁面

  // const checkUserLogin = () => {
  //   axios.post(`${BASE_URL}/v2/api/user/check`)
  //     .then((res) => {
  //       setIsAuth(true)
  //       getProducts();
  //     })
  //     .catch((err) => alert("登入失敗!"))
  // } //若驗證成功則跳轉到後台產品頁面

  // useEffect(() => {
  //   const token = document.cookie.replace(
  //     /(?:(?:^|.*;\s*)myToken\s*\=\s*([^;]*).*$)|^.*$/,
  //     "$1",
  //   );
  //   axios.defaults.headers.common['Authorization'] = token;
  //   checkUserLogin();
  // }, []) //驗證帶入token

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="mb-5">歡迎登入</h1>
      <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
        <div className="form-floating mb-3">
          <input name="username" value={account.username} onChange={handleInputChange} type="email" className="form-control" id="username" placeholder="name@example.com" />
          <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
          <input name="password" value={account.password} onChange={handleInputChange} type="password" className="form-control" id="password" placeholder="Password" />
          <label htmlFor="password">Password</label>
        </div>
        <button className="btn btn-success">登入</button>
      </form>
      <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 乳蛋農產品</p>
    </div>
  )
}

export default LoginPage;