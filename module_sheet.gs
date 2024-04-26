/**
 * 管理Google工作表中的单元格值。
 * 
 * @param {string} action 执行的操作，可以是"GET"或"SET"，不区分大小写。
 *    - "GET": 从指定单元格或范围获取值。
 *    - "SET": 设置指定单元格或范围的值。
 * @param {string} sheetName 工作表的名称。
 * @param {string} cellAddress 单元格或范围的地址（例如：A1, A1:B2）。
 *    - 在"GET"操作中，这表示要读取值的单元格或范围。
 *    - 在"SET"操作中，这表示要设置值的起始单元格。根据提供的值的类型（单个值、一维数组或二维数组），值将从这里开始向下或向右下方向扩展。
 * @param {any} [setValue] 当执行"SET"操作时，设置单元格的值。可以是以下几种类型：
 *    - 单个值（如数字、字符串）：设置单个单元格的值。
 *    - 一维数组：将数组中的每个值依次设置在从cellAddress开始的垂直列中。
 *    - 二维数组：从cellAddress开始，将数组中的值按照其在数组中的结构向右和向下扩展。
 * @returns {any} 
 *    - 如果是"GET"操作，返回单个值或包含值的数组。
 *    - 如果是"SET"操作，返回一个字符串表示成功设置。
 * @throws 如果工作表不存在或未提供设置值，或提供了无效的参数，则抛出错误。
 */
function ManageCellValue(action, sheetName, cellAddress, setValue) {
  //Ver　20240129
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var sheet = ss.getSheetByName(sheetName);

  // 检查该工作表是否存在
  if (!sheet) {
    throw new Error("工作表 " + sheetName + " 不存在。");
  }

  var range = sheet.getRange(cellAddress); // 初始化 range;
  var rangeRow = sheet.getRange(cellAddress).getRow();
  var rangeColumn = sheet.getRange(cellAddress).getColumn();

  // 转换为大写进行比较
  action = action.toUpperCase();

  if (action === "GET") {
    // 判斷是單個單元格還是一個範圍
    if (range.getNumRows() === 1 && range.getNumColumns() === 1) {
      return range.getValue();
    } else {
      // 取得範圍的所有值
      var values = range.getValues();
      // 過濾掉空白的行
      values = values.filter(function(row) {
        return row.some(function(cell) { return cell !== ""; });
      });
      // 如果只有一行有內容，則返回那一行，否則返回整個範圍
      if (values.length === 1) {
        return values[0];
      } else {
        return values;
      }
    }
  
  } else if (action === "GETB") {
    // 判斷是單個單元格還是一個範圍
    if (range.getNumRows() === 1 && range.getNumColumns() === 1) {
      return range.getValue();
    } else {
      // 取得範圍的所有值
      var values = range.getValues();
   
      // 如果只有一行有內容，則返回那一行，否則返回整個範圍
      if (values.length === 1) {
        return values[0];
      } else {
        return values;
      }
    }


  }else if (action === "SET") {
    if (setValue === undefined) {
      throw new Error("For SET action, you must provide a value to set.");
    }
    // 判断setValue是单个值、一维数组还是二维数组
    if (Array.isArray(setValue)) {
      if (Array.isArray(setValue[0])) {
        // 二维数组：从A2向右下方向扩展
        range = sheet.getRange(rangeRow, rangeColumn, setValue.length, setValue[0].length);
        range.setValues(setValue);
      } else {
        // 一维数组：从A2开始向下扩展
        range = sheet.getRange(rangeRow, rangeColumn, setValue.length, 1);
        var verticalArray = setValue.map(function(item) {
          return [item];
        });
        range.setValues(verticalArray);
      }
    } else {
      // 单个值
      range = sheet.getRange(cellAddress);
      range.setValue(setValue);
    }
    return "Value set successfully!";
  } else {
    return "Please decide GET or SET";
  }
}


/**
 * 將二維陣列轉換為一維陣列。
 *
 * @param {Array} array2D 要轉換的二維陣列。
 * @param {String} mode 轉換模式，可選 "X" 或 "Y"。
 * @return {Array} 轉換後的一維陣列。
 */
function ConvertArray2Dto1D(array2D, mode) {
  if (mode === "X") {
    // 標準模式，直接攤平陣列
    return array2D.flat();
  } else if (mode === "Y") {
    // 交替模式，先按列合併，再攤平
    let result = [];
    let maxLength = Math.max(...array2D.map(row => row.length));
    for (let i = 0; i < maxLength; i++) {
      array2D.forEach(row => {
        if (i < row.length) {
          result.push(row[i]);
        }
      });
    }
    return result;
  } else {
    throw new Error("不支援的轉換模式：" + mode + "請輸入英語大寫X或Y");
  }
}

function TransposeArray(array) {
  var transposedArray = [];
  for (var i = 0; i < array[0].length; i++) {
    transposedArray[i] = [];
    for (var j = 0; j < array.length; j++) {
      transposedArray[i][j] = array[j][i];
    }
  }
  return transposedArray;
}
