const states = [
    {
      "StateId": "Browse",
      "StateDescription": "初始",
      "DisplayOperation": [
        "Clear",
        "Filter",
        "Create"
      ],
      "DisableOperation": []
    },
    {
      "StateId": "Result",
      "StateDescription": "查詢",
      "DisplayOperation": [
        "Clear",
        "Filter",
        "Create"
      ],
      "DisableOperation": []
    },
    {
      "StateId": "Detial4Create",
      "StateDescription": "新增",
      "DisplayOperation": [
        "Save",
        "BackToPrevious",
        "Delete",
        "Create"
      ],
      "DisableOperation": [
        "Delete",
        "Create"
      ]
    },
    {
      "StateId": "Detial4Modify",
      "StateDescription": "修改",
      "DisplayOperation": [
        "Save",
        "BackToPrevious",
        "Delete",
        "Create"
      ],
      "DisableOperation": []
    }
  ];

  const gridColOperations = [
    {
      "operationId": "Modify",
      "operationName": "修改",
      "priority": "-1"
    }, {
      "operationId": "Delete",
      "operationName": "刪除",
      "priority": "-1"
    }
  ]

  const operations = [
    {
      "operationId": "Filter",
      "operationName": "查詢",
      "priority": "110"
    },
    {
      "operationId": "Create",
      "operationName": "新增",
      "priority": "240"
    },
    {
      "operationId": "Save",
      "operationName": "存檔",
      "priority": "210"
    }, {
      "operationId": "Delete",
      "operationName": "刪除",
      "priority": "220"
    },
    {
      "operationId": "BackToPrevious",
      "operationName": "回上一頁",
      "priority": "200"
    },
    {
      "operationId": "Clear",
      "operationName": "清畫面",
      "priority": "900"
    },
  ]


  const stateOprRels=[
    {
      "operationId": "Create",
      "stateId": "Detial4Create",
      "nextOperation": ""
    }
  ]
  export {states,gridColOperations,operations,stateOprRels};
  