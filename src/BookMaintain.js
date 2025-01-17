import { useState, useEffect } from "react";
import Book from "./model/Book";
import bookClassData from "./data/book-class-data";
import bookData from "./data/book-data";
import BookSearchArg from './model/BookSearchArg';
import BookGridData from "./model/BookGridData";
import StandardMaintainVM from "./model/StandardMaintainVM";

const BookMaintain = () => {

  // const [vm, setVMValue] = useState(
  //   new MaintainModel(
  //     new BookSearchArg(), [], new Book()));

  const [vm, setVMValue] = useState(
    new StandardMaintainVM(
      BookSearchArg, BookGridData, Book));

  
  const [filterData, setFilterData] = useState(null);
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
      bookId: Math.max(...vm.gridData.rows.map(m => m.BookId)) + 1,
      bookName: vm.detail.bookName,
      bookAuthor: vm.detail.bookAuthor,
      bookClassId: vm.detail.bookClassId,
      bookClassName: bookClassData.find(m => m.value == vm.detail.bookClassId).text,
      bookBoughtDate: vm.detail.bookBoughtDate,
      bookPublisher: vm.detail.bookPublisher
    }];

    setFilterData([...temp, ...vm.gridData.rows]);
    syncVMState("Grid", vm.gridData.rows,"rows");

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
      const bookId = getSeleteedBookId(e.target);
      vm.gridData.rows.splice(
        vm.gridData.rows.findIndex(m => m.bookId == bookId), 1
      );
      setFilterData([...vm.gridData.rows]);
      syncVMState("Grid", vm.gridData.rows,"rows");
    }
  }


  /**
   * 處理查詢書籍
   * @param {*} e 
   */
  const handleFilter = (e) => {
    e.preventDefault();

    const searchText = e.target.value;
    const filterResult = vm.gridData.rows.filter(m =>
      m.bookId == searchText ||
      m.bookName.includes(searchText) ||
      m.bookClassName == searchText ||
      m.bookBoughtDate == searchText ||
      m.bookAuthor.includes(searchText) ||
      searchText == ""
    );
    setFilterData(filterResult);

  }

  const handleShowEdit = (e) => {
    e.preventDefault();

    setPageState("Insert");
    const bookId = getSeleteedBookId(e.target);
    const tempBook = vm.gridData.rows.find(m => m.bookId == bookId);

    const temp = {
      bookId: bookId,
      bookName: tempBook.bookName,
      bookAuthor: tempBook.bookAuthor,
      bookClassId: tempBook.bookClassId,
      bookBoughtDate: tempBook.bookBoughtDate,
      bookPublisher: tempBook.bookPublisher
    }
    syncVMState("Detail", temp);

  }

  const getSeleteedBookId = (target) => {

    const bookId = target.parentElement.
      previousElementSibling.previousElementSibling.previousElementSibling.
      previousElementSibling.previousElementSibling.innerText;

    return bookId;
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
    syncVMState("Grid", temp,"rows")

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
          detialData: data
        }));
      case "Detail":
        if (modelfield!=undefined) {
          setVMValue((prevvm) => ({
            ...prevvm,
            detialData: {
              ...prevvm.detail,
              [modelfield]: data
            }
          }));
        } else {//如果沒有指定欄位就全蓋
          setVMValue((prevvm) => ({
            ...prevvm,
            detialData: data
          }));
        }
        break;
      case "Query":
        setVMValue((prevvm) => ({
          ...prevvm,
          filterArg: {
            ...prevvm.filterArg,
            [modelfield]: data
          }
        }));
        break;
      case "Grid":

        if(modelfield!=undefined){
          setVMValue((prevvm) => ({
            ...prevvm,
            gridData:{
              ...prevvm.gridData,
              ["rows"]:data
            }
          }));
          
        }else{
          setVMValue((prevvm) => ({
            ...prevvm,
            gridData: data
          }));
          //alert(2)
          console.log(modelfield);
        }


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
    
    localStorage.setItem("bookData", JSON.stringify(vm.gridData.rows));
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
                  value={vm.detialData.bookClassId || ""} >
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
                <input id="book_name" type="text" className="form-control" style={{ width: "100%" }} data-field="bookName" onChange={handleVMValueChange} value={vm.detialData.bookName || ""} />
              </li>
              <li>
                <label>作者</label>
                <input id="book_author" type="text" className="form-control" style={{ width: "100%" }} data-field="bookAuthor" onChange={handleVMValueChange} value={vm.detialData.bookAuthor || ""} />
              </li>
              <li>
                <label>購買日期</label>
                <input id="bought_datepicker" className="form-control" type='date' title="datepicker" style={{ width: "100%" }} data-field="bookBoughtDate" onChange={handleVMValueChange} value={vm.detialData.bookBoughtDate || ""} />
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
                <input className="form-control" placeholder="請輸入查詢條件..." data-field="bookName" onChange={handleVMValueChange} onInput={handleFilter} value={vm.filterArg.bookName || ""}></input>
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
                      (filterData != null ? filterData : vm.gridData.rows).map(element => {
                        return (
                          <tr key={"tr" + element.bookId}>
                            <td style={{ textAlign: "center" }}>{element.bookId}</td>
                            <td>{element.bookName}</td>
                            <td>{element.bookClassName}</td>
                            <td>{element.bookAuthor}</td>
                            <td style={{ textAlign: "center" }}>{element.bookBoughtDate}</td>
                            <td style={{ textAlign: "center" }}>
                              <a src="#" className="btn btn-outline-primary mx-1" onClick={handleDelete}>刪除</a>
                              <a src="#" className="btn btn-outline-primary mx-1" onClick={handleShowEdit}>編輯</a>
                            </td>
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