//open in Google sheet
//https://docs.google.com/spreadsheets/d/1u2hvxTYtuzlLtk1a8h5ovNsFIzgdPPsHbbs33lXlo4Y/edit?usp=sharing

OPENAI_API_KEY = ManageCellValue('GET', 'panel', 'C4');
description = ManageCellValue('GET', 'panel', 'C6');

function generate_candidate_prompts() {

//システムプロンプトの設定
var gen_system_prompt = "Your job is to generate system prompts for GPT-4, given a description of the use-case and some test cases.The prompts you will be generating will be for freeform tasks, such as generating a landing page headline, an intro paragraph, solving a math problem, etc.In your generated prompt, you should describe how the AI should behave in plain English. Include what it will see, and what it's allowed to output. Be creative with prompts to get the best possible results. The AI knows it's an AI -- you don't need to tell it this.You will be graded based on the performance of your prompt... but don't cheat! You cannot include specifics about the test cases in your prompt. Any prompts with examples will be disqualified.Most importantly, output NOTHING but the prompt. Do not include anything else in your message."

//Sheetとより情報を取得

var prompt_number = ManageCellValue('GET', 'panel', 'C3');
var had_prompt =  ManageCellValue('GET', 'candidate', 'B2:B');
var get_prompt_times = prompt_number - had_prompt.length;
Logger.log('Prompt取得回数' + get_prompt_times);

//初期化
ManageCellValue('SET', 'panel', 'F3',0);
var range_row = prompt_number +1;
var rating_range = 'C2:C'+range_row
ManageCellValue('SET', 'candidate', rating_range,1200);

var candidate_prompts = ConvertArray2Dto1D(had_prompt, 'X');
Logger.log(candidate_prompts);

var test_cases = ConvertArray2Dto1D(ManageCellValue('GET', 'panel', 'C8:C'),"X");
var mission = `Here are some test cases:${test_cases}\n\nHere is the description of the use-case: ${had_prompt[0]}\n\nRespond with your prompt, and nothing else. Be creative.`
var str_range = had_prompt.length +2 ; 
var set_range = 'B' + str_range.toString();
Logger.log(set_range);
for (let i = 0 ; i<get_prompt_times ; i++){

candidate_prompts.push(ChatGPT(OPENAI_API_KEY,gen_system_prompt, mission , 1000 ,'gpt-4' , 0.9));

}
ManageCellValue('SET', 'candidate', set_range ,candidate_prompts.slice(had_prompt.length));
var test_times = prompt_number * (prompt_number-1 )/ 2 * test_cases.length
ManageCellValue('SET', 'panel', 'G3' ,test_times);
Logger.log('比較する回数：' +test_times);
match_list();
}



function match_list() {

//便宜上のデータ
var prompts = ManageCellValue('GET', 'candidate', 'B2:B');
var prompts_number = prompts.length
var test_cases = ConvertArray2Dto1D(ManageCellValue('GET', 'panel', 'C8:C'),"X");
//ELOの位置情報と原始点数を作る
var box = [[], []];
for (let i = 0 ; i<prompts_number ; i++){
let cell_row = i+2 ;  
box[0].push('C'+ cell_row);
box[1].push(1200);
}



var test_set = Combinations(prompts, 2);
var rate_set = Combinations(box[0], 2);

var match_set = [[],[],[],[],[]];
for (let i = 0 ; i< test_cases.length;i++){
for (let j = 0 ; j<test_set.length  ;j++){
match_set[0].push(test_set[j][0]);
match_set[1].push(test_set[j][1]); 
match_set[2].push(test_cases[i]);
match_set[3].push(rate_set[j][0]);
match_set[4].push(rate_set[j][1]);


}
}
ManageCellValue('SET', 'match', 'A2' ,TransposeArray(match_set));


//Logger.log(match_set);
//Logger.log(rate_set);
}


function ranking(prompt_A,prompt_B,test_question) {
var ranking_system_prompt = 'Your task is to evaluate the quality of outputs generated from two different prompts. These prompts are used to generate a response for a specific task. First, you will describe reasons why A might be better than B, then describe reasons why B might be better than A, and finally decide whether A or B is better. You will receive the task description, the test prompt, and two generations - one for each system prompt. If Generation A is better, respond with "A". If Generation B is better, respond with "B". Remember, to be considered "better", a generation must not just be good, it must be noticeably superior to the other. Also, remember that you are a very harsh critic. Only rank a generation as better if it truly impresses you more than the other. Please respond in the following JSON format: {"judgement":{"reasons_A_might_be_better":(A concise sentence),"reasons_B_might_be_better":(A concise sentence),"final_decision":"(must be uppercase A or B)"}}'

var pos1 = ChatGPT(OPENAI_API_KEY, test_question , prompt_A , 500 ,'gpt-3.5-turbo' , 0.7);
var pos2 = ChatGPT(OPENAI_API_KEY, test_question , prompt_B , 500 ,'gpt-3.5-turbo' , 0.7);

var prompt_for_judge1 = `"""Task:'${description}\nPrompt:${test_question}\nGeneration A: \n${pos1}\nGeneration B:\n${pos2}""" `
var prompt_for_judge2 = `"""Task:'${description}\nPrompt:${test_question}\nGeneration A: \n${pos2}\nGeneration B:\n${pos1}""" `


var round1= ChatGPTv2(OPENAI_API_KEY,prompt_for_judge1, ranking_system_prompt, 400, 'gpt-3.5-turbo-1106', 0.4);
var round2= ChatGPTv2(OPENAI_API_KEY,prompt_for_judge2, ranking_system_prompt, 400, 'gpt-3.5-turbo-1106', 0.4);
Logger.log(round1);
Logger.log(round2);
var round1_json =JSON.parse(round1);
var round2_json =JSON.parse(round2);

var result_round1 = round1_json.judgement.final_decision
var result_round2 = round2_json.judgement.final_decision

Logger.log('round1:'+result_round1);

Logger.log('round2:'+result_round2);


if (result_round1 == 'A' && result_round2 == 'B'){
var judge = 1
}else if(result_round1 == 'B' && result_round2 == 'A'){
var judge = 0
}else if(result_round1 == 'B' && result_round2 == 'B'){
var judge = 0.5   
}else if(result_round1 == 'A' && result_round2== 'A'){
var judge = 0.5  
}else{
var judge = 'error'   
}
Logger.log(judge);
if(judge == 1){
var reason = round1_json.judgement.reasons_A_might_be_better + '&' + round2_json.judgement.reasons_B_might_be_better ;

}else if(judge == 0){
var reason = round1_json.judgement.reasons_B_might_be_better + '&' + round2_json.judgement.reasons_A_might_be_better ;
}else{
var reason = '引き分け'
}

return [judge,pos1,pos2,reason] ;
}

function test() {
var prompt_A = 'あなたはAIです。あなたが見るのは、あるセミナーのテーマに関する短い記述です。そのテーマに基づいて、台湾の日系企業の経営者向けに魅力的で情報豊富なセミナータイトルを3つ提案してください。それぞれのタイトルは具体的で、主題に関連していて、そして参加者が期待する内容をよく反映しているようにしてください。それぞれの提案はユニークである必要があり、他の提案と重複しないようにしてください。'
var prompt_B = 'Given the topic and the target audience, which is the management of Japanese companies in Taiwan, you need to come up with three imaginative and engaging titles for the seminar. While you should consider the specific needs and interests of this group, avoid using overly technical jargon. You are expected to make the seminar appealing to the audience, so make sure your titles reflect the unique value or insights that the seminar will provide.'
var test_question = '生成AIのセミナ−のタイトルをください' 
ranking(prompt_A,prompt_B,test_question) ;
}



function main_process() {
var total_times = ManageCellValue('GET', 'panel', 'G3');
var now_times = ManageCellValue('GET', 'panel', 'F3');
var data = ManageCellValue('GET', 'match', 'A2:E');
Logger.log(data[0][1]);//B2

for(let i = now_times ; i< total_times; i++){
Logger.log('【PromptA】:' + data[i][0]);
Logger.log('【PromptB】:' + data[i][1]);
Logger.log('【TestingQuestion】:' + data[i][2]);

let vs_result = ranking(data[i][0],data[i][1],data[i][2]);
let ratingA = ManageCellValue('GET', 'candidate', data[i][3]);
let ratingB = ManageCellValue('GET', 'candidate', data[i][4]);
Logger.log(vs_result);
Logger.log(data[i][3]);
Logger.log(ratingA);
let new_socre = updateEloRating(ratingA, ratingB, vs_result[0], kFactor = 30) ;
Logger.log(new_socre);
ManageCellValue('SET', 'candidate', data[i][3],new_socre[0]);
ManageCellValue('SET', 'candidate', data[i][4],new_socre[1]);
let record = [[vs_result[1],vs_result[2],vs_result[0],vs_result[3],new_socre[0],new_socre[1]]]
let cell_row = i+2;
let record_cell = 'F' + cell_row
ManageCellValue('SET', 'match', record_cell,record);
ManageCellValue('SET', 'panel', 'F3',i+1);

}


}

function initialization() {
var prompt_number = ManageCellValue('GET', 'panel', 'C3');
ManageCellValue('SET', 'panel', 'F3',0);
var range_row = prompt_number +1;
var rating_range = 'C2:C'+range_row
var candidate_range = 'B2:B'+range_row
ManageCellValue('SET', 'candidate', rating_range,1200);
ManageCellValue('SET', 'candidate', candidate_range ,'');
ManageCellValue('SET', 'match', 'A2:K' ,'');
}
