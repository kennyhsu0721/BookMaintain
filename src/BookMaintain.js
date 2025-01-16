import { useState, useEffect } from "react";
import Book from "./model/Book";
import bookClassData from "./data/book-class-data";
import bookData from "./data/book-data";
import MaintainModel from "./model/MaintainModel";
import BookSearchArg from './model/BookSearchArg';

const BookMaintain = () => {

  const [vm, setVMValue] = useState(
    new MaintainModel(
      new BookSearchArg(), [], new Book()));

  const [filterData, setFilterData] = useState([]);
  const [pageState, setPageState] = useState("Query");

  /**
   * 處理使用者改變畫面資料
   * @param {*} e 
   */
  const handleVMValueChange = (e) => {
    const value = e.target.value;
    const modelfield = e.target.dataset.field;
    const anchor = e.target.closest("[data-anchor]").dataset.anchor;

    syncVMState(anchor, value, modelfield);
  }

  /**
   *
   * 處理畫面新增區塊與 Gird 區塊的隱藏與顯示
   * @param {*} e
   */
  const handleShowBookForm = (e) => {
    setPageState("Insert");
  }

  /**
   * 處理新增書籍
   * @param {*} e 
   */
  const handleInsertBook = (e) => {
    const temp = [{
      BookId: Math.max(...vm.gridData.map(m => m.BookId)) + 1,
      BookName: vm.detail.bookName,
      BookAuthor: vm.detail.bookAuthor,
      BookClassId: vm.detail.bookClassId,
      BookClassName: bookClassData.find(m => m.value == vm.detail.bookClassId).text,
      BookBoughtDate: vm.detail.bookBoughtDate,
      BookPublisher: vm.detail.BookPublisher
    }];

    setFilterData([...temp, ...vm.gridData]);
    syncVMState("Grid", vm.gridData);

    //新增成功後將畫面清空
    syncVMState("Default", new Book());
    alert("新增成功");
  }

  /**
   * 處理刪除書籍
   *
   * @param {*} e
   */
  const handleDelete = (e) => {
    e.preventDefault();

    if (window.confirm("確認刪除")) {
      const bookId = e.target.parentElement.
        previousElementSibling.previousElementSibling.previousElementSibling.
        previousElementSibling.previousElementSibling.innerText;

      vm.gridData.splice(
        vm.gridData.findIndex(m => m.BookId == bookId), 1
      )

      setFilterData([...vm.gridData]);
      syncVMState("Grid", vm.gridData);
    }
  }


  /**
   * 處理查詢書籍
   * @param {*} e 
   */
  const handleFilter = (e) => {
    e.preventDefault();

    const searchText = e.target.value;
    const filterResult = vm.gridData.filter(m =>
      m.BookId == searchText ||
      m.BookName.includes(searchText) ||
      m.BookClassName == searchText ||
      m.BookBoughtDate == searchText ||
      m.BookAuthor.includes(searchText) ||
      searchText == ""
    );

    setFilterData(filterResult);

  }

  /**
   * 讀取預設資料
   */
  const loadBookData = () => {
    let temp = JSON.parse(localStorage.getItem("bookData"));

    if (!temp) {
      temp = bookData;
      localStorage.setItem("bookData", JSON.stringify(temp));
    }
    setFilterData(temp);
    syncVMState("Grid", temp)
  }

  /**
   * 更新頁面狀態
   * @param {} anchor 
   * @param {*} data 
   * @param {*} modelfield 
   */
  const syncVMState = (anchor, data, modelfield) => {

    switch (anchor) {
      case "Default":
        setVMValue((prevvm) => ({
          ...prevvm,
          detail: data
        }));
      case "Detail":
        setVMValue((prevvm) => ({
          ...prevvm,
          detail: {
            ...prevvm.detail,
            [modelfield]: data
          }
        }));
        break;
      case "Query":
        setVMValue((prevvm) => ({
          ...prevvm,
          searchArg: {
            ...prevvm.searchArg,
            [modelfield]: data
          }
        }));
        break;
      case "Grid":
        setVMValue((prevvm) => ({
          ...prevvm,
          gridData: data
        }));
        break;
      default:
        break;
    }

  }

  /**
   * 初始化頁面所需資料
   */
  useEffect(() => {
    loadBookData();
  }, [])


  /**
   * 當 Grid Data 更新時、處理 localStorage
   */
  useEffect(() => {
    localStorage.setItem("bookData", JSON.stringify(vm.gridData));
  }, [vm.gridData]);



  return (
    <div className="container-md">
      {
        pageState == "Insert" &&
        (
          <div data-anchor="Detail">
            <ul className="fieldlist">
              <li>
                <img className="book-image" src="image/database.jpg" alt="" />
              </li>
              <li>
                <label>圖書類別</label>
                <select id="book_class"
                  className="form-select" style={{ width: "100%" }} data-field="bookClassId" onChange={handleVMValueChange}
                  value={vm.detail.bookClassId || ""} >
                  <option>請選擇</option>
                  {
                    bookClassData.map(element => {
                      return <option key={element.value} value={element.value} >{element.text}</option>
                    })
                  }
                </select>
              </li>
              <li>
                <label>書名</label>
                <input id="book_name" type="text" className="form-control" style={{ width: "100%" }} data-field="bookName" onChange={handleVMValueChange} value={vm.detail.bookName || ""} />
              </li>
              <li>
                <label>作者</label>
                <input id="book_author" type="text" className="form-control" style={{ width: "100%" }} data-field="bookAuthor" onChange={handleVMValueChange} value={vm.detail.bookAuthor || ""} />
              </li>
              <li>
                <label>購買日期</label>
                <input id="bought_datepicker" className="form-control" type='date' title="datepicker" style={{ width: "100%" }} data-field="bookBoughtDate" onChange={handleVMValueChange} value={vm.detail.bookBoughtDate || ""} />
              </li>
              <li className="uk-text-right">
                <button className="btn btn-outline-primary" onClick={handleInsertBook}>新增</button>
                <button className="btn btn-outline-primary" onClick={() => { setPageState("Query") }}>取消</button>
              </li>
            </ul>
          </div>
        )
      }
      {
        pageState == "Query" &&
        (
          <>
            <div data-anchor="Query">
              <div className="mb-3">
                <button id="btn-show-add-book" className="btn btn-outline-primary" onClick={handleShowBookForm}>新增書籍</button>
              </div>
              <div className="mb-3">
                <input className="form-control" placeholder="請輸入查詢條件..." data-field="bookName" onChange={handleVMValueChange} onInput={handleFilter} value={vm.searchArg.bookName || ""}></input>
              </div>
            </div>
            <div data-anchor="grid">
              <div id="book_grid" className="mb-3">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <td style={{ textAlign: "center", width: "10%" }}>書籍編號</td>
                      <td style={{ textAlign: "center", width: "35%" }}>書籍名稱</td>
                      <td style={{ textAlign: "center", width: "15%" }}>書籍種類</td>
                      <td style={{ textAlign: "center", width: "15%" }}>作者</td>
                      <td style={{ textAlign: "center" }}>購買日期</td>
                      <td></td>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      (filterData.length != 0 ? filterData : vm.gridData).map(element => {
                        return (
                          <tr key={"tr" + element.BookId}>
                            <td style={{ textAlign: "center" }}>{element.BookId}</td>
                            <td>{element.BookName}</td>
                            <td>{element.BookClassName}</td>
                            <td>{element.BookAuthor}</td>
                            <td style={{ textAlign: "center" }}>{element.BookBoughtDate}</td>
                            <td style={{ textAlign: "center" }}><a src="#" className="btn btn-outline-primary" onClick={handleDelete}>刪除</a></td>
                          </tr>);
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )
      }
    </div>
  )
}

export default BookMaintain;