import React, {useState,useRef,useEffect,forwardRef, useImperativeHandle } from 'react'
import StandardMaintainVM from "./model/StandardMaintainVM";
// const StateControl=({stateOperations,eventHandler})=>{
const StandMaintainPageTemplate = forwardRef(({filterArgType,gridDataType,detialDataType,canRun,vm,setVMValue},ref) => {
    
    const pageState = useRef("");
    const onPageInitRef=useRef(()=>{
        alert('bb (原始 onPageInit)');
    })
    
    useImperativeHandle(ref,()=>({
        setOnpageInit:(fn)=>{
            onPageInitRef.current=fn
        },
        pageEventHandler,
        handleVMValueChange,
        getPageState:()=>pageState.current
    }),[]);

    
    useEffect(() => {
        if(canRun) {
            onPageInitRef.current();    
        }
        
    }, [canRun])

    const pageEventHandler =(e, operationId) => {
        switch (operationId) {
          case "Create"://新增
            // changeCurrentState(operationId);
            // setOperation();
            // initDetail(operationId);
            break;
          case "Filter"://查詢
            // pageState.current = "Result";
            // setOperation();
            // onFilter();
            break;
          case "Modify"://修改
            // pageState.current = "Detial4Modify";
            // initDetail(operationId);
            // setOperation();
            break;
          case "Delete"://刪除
            // pageState.current = "Result";
            // deleteData();
            // setOperation();
            break;
          case "Save"://存檔
            // // pageState.current = "Detial4Modify";
            // debugger;
            // save(operationId);
            // setOperation();
            break;
          case "BackToPrevious"://回前頁
            // pageState.current = "Result";
            // setOperation();
            break;
          case "Clear"://清畫面
            pageState.current = "Result";
            vm.filterArg.arg = new filterArgType();
            onFilter();
            // setOperation();
            break;
          case "Init"://初始
          debugger
            onPageInitRef();
            break;
          default:
            break;
        }
    }

    const handleVMValueChange = (e) => {

        const value = e.target.value;
        const modelfield = e.target.dataset.field;
        if (pageState.current == "Result") {
          syncVMValue("Filter", value, modelfield);
        }
        if (pageState.current == "Detial4Create" || pageState.current == "Detial4Modify") {
          syncVMValue("Modify", value, modelfield);
        }
      }

      const syncVMValue = (operationId, data, modelfield) => {

        switch (operationId) {
          case "Create":
            setVMValue((prevvm) => ({
              ...prevvm,
              detialData: data
            }));
          case "Modify":
            if (modelfield != undefined) {
              setVMValue((prevvm) => ({
                ...prevvm,
                detialData: {
                  ...prevvm.detialData,
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
          case "Filter":
            setVMValue((prevvm) => ({
              ...prevvm,
              filterArg: {
                arg: {
                  ...prevvm.filterArg.arg,
                  [modelfield]: data
                }
              }
            }));
            break;
          case "Grid":
    
            if (modelfield != undefined) {
              setVMValue((prevvm) => ({
                ...prevvm,
                gridData: {
                  ...prevvm.gridData,
                  [modelfield]: data
                }
              }));
            } else {
              setVMValue((prevvm) => ({
                ...prevvm,
                gridData: data
              }));
            }
            break;
          default:
            break;
        }
      }

    const onFilter = () => {

        const filterPack = async () => {
          try {
            await implBeforeFilter();
            await implFilter();
            await implAfterFilter();
          } catch (error) {
            alert("系統發生錯誤");
          }
        }
        filterPack();
      }
    
    
      const implBeforeFilter = () => {
        return new Promise((resolve, reject) => {
           
          resolve();
          //reject("You Information!!");
        })
      }
    
      const implFilter = () => {
        return new Promise((resolve, reject) => {
           
            debugger;
           const searchText = vm.filterArg.arg.bookName;
           alert(searchText);
        //   const filterResult = vm.gridData.rows.filter(m =>
        //     m.bookId == searchText ||
        //     m.bookName.includes(searchText) ||
        //     m.bookClassName == searchText ||
        //     m.bookBoughtDate == searchText ||
        //     m.bookAuthor.includes(searchText) ||
        //     searchText == ""
        //   );
        //   setFilterData(filterResult);
          resolve();
          //reject("You Information!!");
        })
      }

      const implAfterFilter = () => {
        return new Promise((resolve, reject) => {
           
          resolve();
          //reject("You Information!!");
        })
      }

  return (<span>{vm.filterArg.arg.bookName || ""}</span>)
});

export default StandMaintainPageTemplate