let job = "";
let body = "";

const stopWords = new Set(["as","an","the","be","and","for","with","that",
  "this","from","are","was","were","will","shall","have","of","in","you",
  "your","our","their","them","they","is","may","include","such","all",
  "both","under","while","us","to","a","we","or","about","can","its","on",
  "who","those","have","up","year","but","not","after"
]);

const techWords = new Set(["ITIL","PC","Mac","Jira","Windows","CompTIA","iPhone","C++",".NET","A/V",
"information technology","AR/VR","UX","software","Microsoft","CCNA","Firewall","VPN","html","SharePoint",
"php","css","javascript","Active Directory","router","computer","network","RJ45","Intune","Autopilot", 
"SCCM","server","operating system","TCP","DHCP","DNS","OneDrive","Azure","SQL","C#",
"ServiceNow","Zendesk","Bing","Office 365","XBOX","Python"]);

function extractKeywords() {
  let text = document.getElementById("jobInput").value;
  if(text.trim().length == 0) {
    alert("Error, empty input...");
    throw new Error ("empty input!");
  }
  simpleMode(text);  
}

function simpleMode(text) {  
  let sentence = text
    .split(/[\n:]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);//remove white space
  const patterns = [
    /\b([A-Z][a-zA-Z0-9.+#-]*(?:\s[A-Z0-9][a-zA-Z0-9.+#-]*)+)/g,//multi capital words
    /(?<!\w)(?=\S*[A-Z])[\w.+#-/]+/g,//single capital word
    /\b[A-Za-z]+(?:[.+#/-][A-Za-z0-9]+)*\b/g,//single special symbol word
    /\b([a-z]{3,}(?:\s[a-z]{3,})+)\b/g//multi lower words
  ];
 
  let techTerm = [];
  sentence.forEach(s => {//capture capital special symbol tech words
    patterns.forEach(regex=>{
      const matches = s.match(regex) || [];      
      matches.forEach(term => {
        term = term.replace(/[(),]/g,"");
        term = term.split(/\s+/) 
        .filter(word => word && !stopWords.has(word.toLowerCase()))
        .join(" ");
        if(!stopWords.has(term) && term.length > 1)techTerm.push(term);
      });
    });
  });
 
  let techFinal = [];
  let techArr = [...techWords].map(t => t.toLowerCase());
  const seen = new Set();
  let cleanedWords=[];
  //tokenize to capture single tech word
  sentence.forEach((st) => {
    let words = st.split(/\s+/);
    let cleaned=words.filter(word => {
      return !stopWords.has(word.toLowerCase());
    }).map((w) => w.replace(/[^\w-]/g, "")) // remove punctuation, keep hyphen word
    .map((w) => w.trim())
    .filter((w) => w.length > 0);
    cleaned.forEach(w => cleanedWords.push(w));
  }); 

  cleanedWords.forEach(term => {
    let lowerTerm = term.toLowerCase();
    if (techArr.some(t => lowerTerm === t)) {      
      techTerm.push(term);      
    }
  });
  techFinal = techTerm
  .filter(term =>
      techArr.some(t => term.toLowerCase().includes(t))//includes term contains technical word
  )
  .filter(term => {
    const lower = term.toLowerCase().replace(/[^a-z0-9+#.]/g,"");//normalize term
    if ([...seen].some(s => s.includes(lower))) return false;//remove words with duplicate part
    seen.add(lower);
    return true;
  });
  displayResults(techFinal,"");
}


function displayResults(keywords,job) {
  const resultsDiv = document.getElementById("results");
  const jobContainer = document.createElement("div");
  let htmlContent;
  jobContainer.className = "job-item";
  if(job){
    htmlContent = `<div class='section-title'>Keywords for: ${job}</div>`;
  }
  else{
    htmlContent = `<div class='section-title'>Top Keywords:</div>`
  }
  keywords.forEach((keyword) => {    
    htmlContent += `<span class="keyword">${keyword}</span> `;
  });
  jobContainer.innerHTML = htmlContent;
  resultsDiv.prepend(jobContainer);
}

document.getElementById("extractBtn").addEventListener("click", () => {
  extractKeywords();
});