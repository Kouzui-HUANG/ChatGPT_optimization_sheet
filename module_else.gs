/**
 * Eloレーティングを更新する
 *
 * @param {number} ratingA Aの現在のレーティング
 * @param {number} ratingB Bの現在のレーティング
 * @param {number} result 勝敗の結果（Aの勝ち: 1, 引き分け: 0.5, Bの勝ち: 0）
 * @param {number} kFactor Kファクター（通常は30、大会によって異なるかもしれません）
 * @return {Array<number>} 更新されたレーティング [新しいAのレーティング, 新しいBのレーティング]
 */
function updateEloRating(ratingA, ratingB, result, kFactor = 30) {
  // AとBの期待スコアを計算
  const expectedA = 1 / (1 + 10 ** ((ratingB - ratingA) / 400));
  const expectedB = 1 / (1 + 10 ** ((ratingA - ratingB) / 400));

  // 新しいレーティングを計算
  const newRatingA = ratingA + kFactor * (result - expectedA);
  const newRatingB = ratingB + kFactor * (1 - result - expectedB);

  // 更新されたレーティングを返す
  Logger.log(newRatingA);
  Logger.log(newRatingB);
  return [newRatingA, newRatingB];
}

// 使用例
function testUpdateEloRating() {
  const ratingA = 1200;
  const ratingB = 1300;
  const result = 1; // AがBに勝った場合
  const updatedRatings = updateEloRating(ratingA, ratingB, result);
  Logger.log('更新されたレーティング: A = ' + updatedRatings[0] + ', B = ' + updatedRatings[1]);
}


/**
 * Generates all combinations of the elements in the provided array.
 * @param {Array} １D　array - The array from which to generate combinations.
 * @param {number} combinationSize - The size of each combination.
 * @return {Array} An array containing all combinations as sub-arrays.
 */
function Combinations(array, combinationSize) {
  var n = array.length;
  var indices = [];
  var combinations = [];

  // Initialize the first combination
  for (var i = 0; i < combinationSize; i++) {
    indices.push(i);
  }

  while (indices[combinationSize - 1] < n) {
    // Add current combination to the list
    var currentCombination = [];
    for (var j = 0; j < combinationSize; j++) {
      currentCombination.push(array[indices[j]]);
    }
    combinations.push(currentCombination);

    // Move to the next combination
    // Find the rightmost element that is not at its maximum
    var t = combinationSize - 1;
    while (t >= 0 && indices[t] == n - combinationSize + t) {
      t--;
    }

    // If there is no more combination to generate, break
    if (t < 0) break;

    // Increase this element
    indices[t]++;
    for (var k = t + 1; k < combinationSize; k++) {
      indices[k] = indices[k - 1] + 1;
    }
  }

  return combinations;
}


function Retry(func, maxAttempts, delay) {
  return function() {
    var args = arguments;
    for (var attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return func.apply(this, args);
      } catch (e) {
        if (attempt === maxAttempts) {
          throw e;
        }
        Utilities.sleep(delay);  // 延遲一段時間後重試，單位為毫秒
        console.log('Retrying... Attempt #' + attempt);
      }
    }
  };
}
