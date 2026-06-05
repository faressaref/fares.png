
async function getProjects(){
const snap = await window.getDocs(window.collection(window.db,'projects'));
return snap.docs.map(d=>({id:d.id,...d.data()}));
}
async function renderProjects(){
const wrap=document.getElementById('projects');
if(!wrap) return;
wrap.innerHTML='';
const projects=await getProjects();
projects.forEach((p)=>{
wrap.innerHTML+=`<div class="project-card">
${p.cover?`<img src="${p.cover}" style="width:100%;height:140px;object-fit:cover;border-radius:10px;">`:''}
<h3>${p.name}</h3>
<p>${p.category||''}</p>
<div style="display:flex;gap:8px">
<button onclick="editProject('${p.id}')">Edit</button>
<button onclick="deleteProject('${p.id}')">Delete</button>
</div>
</div>`;
});
}
function newProject(){localStorage.removeItem('editProject');location.href='builder.html';}
async function editProject(id){
const projects=await getProjects();
const p=projects.find(x=>x.id===id);
if(!p) return;
localStorage.setItem('editProject',JSON.stringify(p));
location.href='builder.html';
}

async function deleteProject(id){
if(confirm('Delete project?')){
 await window.deleteDoc(window.doc(window.db,'projects',id));
 await renderProjects();
}
}

function addBlock(type){
const canvas=document.getElementById('canvas');
if(!canvas) return;

const block=document.createElement('div');
block.className='block';

if(type==='heading') block.innerHTML='<input placeholder="Heading">';
if(type==='text') block.innerHTML='<textarea rows="5" placeholder="Paragraph"></textarea>';

if(type==='image'){
block.innerHTML='<input class="image-url" placeholder="Image URL"><div></div>';
block.querySelector('input').addEventListener('input',e=>{
block.querySelector('div').innerHTML=e.target.value.trim()?'<img class="preview" src="'+e.target.value.trim()+'">':'';
});
}

if(type==='grid'){
block.innerHTML=`
<div class="grid-links">
<input class="grid-url" placeholder="Image URL 1">
<input class="grid-url" placeholder="Image URL 2">
<input class="grid-url" placeholder="Image URL 3">
<input class="grid-url" placeholder="Image URL 4">
<input class="grid-url" placeholder="Image URL 5">
<input class="grid-url" placeholder="Image URL 6">
</div>
<div class="grid-preview"></div>`;
const updateGrid=()=>{
const g=block.querySelector('.grid-preview');
g.innerHTML='';
block.querySelectorAll('.grid-url').forEach(inp=>{
 if(inp.value.trim()){
   g.innerHTML += '<img src="'+inp.value.trim()+'">';
 }
});
};
block.querySelectorAll('.grid-url').forEach(inp=>inp.addEventListener('input',updateGrid));
}

const tools=document.createElement('div');
tools.className='toolbar';
tools.innerHTML='<button onclick="moveBlock(this,-1)">↑</button><button onclick="moveBlock(this,1)">↓</button><button onclick="this.closest(\'.block\').remove()">Delete</button>';
block.appendChild(tools);
canvas.appendChild(block);
}

async function saveProject(){
const cover=document.getElementById('cover')?.value||'';
const editData=JSON.parse(localStorage.getItem('editProject')||'null');
const gallery=[];
document.querySelectorAll('.grid-url').forEach(i=>{if(i.value.trim()) gallery.push(i.value.trim())});

const blocks=[];
document.querySelectorAll('.image-url').forEach(i=>{
 if(i.value.trim()) blocks.push({type:'image',image:i.value.trim()});
});
const p={
name:document.getElementById('projectName')?.value||'Untitled',
category:document.getElementById('category')?.value||'',
bio:document.getElementById('bio')?.value||'',
cover,
gallery,
blocks,
featured:document.getElementById('featured')?.checked||false,
createdAt:Date.now()
};
if(editData && editData.id){
try{
 await window.updateDoc(window.doc(window.db,'projects',editData.id),p);
 localStorage.removeItem('editProject');
}catch(e){
 console.warn('Update failed, creating new project',e);
 await window.addDoc(window.collection(window.db,'projects'),p);
 localStorage.removeItem('editProject');
}
}else{
 await window.addDoc(window.collection(window.db,'projects'),p);
}
alert('Project Saved');
location.href='admin.html';
}


window.addEventListener('load',()=>{
  const wait=setInterval(()=>{
    if(window.db && window.collection && window.getDocs){
      clearInterval(wait);
      renderProjects();
    }
  },100);
});


window.addEventListener('load',()=>{
const ep=JSON.parse(localStorage.getItem('editProject')||'null');
if(ep && document.getElementById('projectName')){
projectName.value=ep.name||'';
category.value=ep.category||'';
bio.value=ep.bio||'';
cover.value=ep.cover||'';
featured.checked=!!ep.featured;

const canvas=document.getElementById('canvas');

if(canvas && ep.blocks && ep.blocks.length){
 ep.blocks.forEach(b=>{
  const block=document.createElement('div');
  block.className='block';
  block.innerHTML='<input class="image-url" placeholder="Image URL"><div><img class="preview" src="'+(b.image||'')+'"></div>';
  block.querySelector('.image-url').value=b.image||'';
  const tools=document.createElement('div');tools.className='toolbar';tools.innerHTML='<button onclick="moveBlock(this,-1)">↑</button><button onclick="moveBlock(this,1)">↓</button><button onclick="this.closest(\'.block\').remove()">Delete</button>';block.appendChild(tools);
  canvas.appendChild(block);
 });
}

if(canvas && ep.gallery && ep.gallery.length){
 const block=document.createElement('div');
 block.className='block';
 block.innerHTML=`
 <div class="grid-links">
 <input class="grid-url" placeholder="Image URL 1">
 <input class="grid-url" placeholder="Image URL 2">
 <input class="grid-url" placeholder="Image URL 3">
 <input class="grid-url" placeholder="Image URL 4">
 <input class="grid-url" placeholder="Image URL 5">
 <input class="grid-url" placeholder="Image URL 6">
 </div>
 <div class="grid-preview"></div>`;

 const inputs=block.querySelectorAll('.grid-url');
 ep.gallery.forEach((url,i)=>{
   if(inputs[i]) inputs[i].value=url;
 });

 const g=block.querySelector('.grid-preview');
 ep.gallery.forEach(url=>{
   if(url) g.innerHTML += '<img src="'+url+'">';
 });

 canvas.appendChild(block);
}
}
});

window.saveProject=saveProject;window.addBlock=addBlock;window.newProject=newProject;window.editProject=editProject;window.deleteProject=deleteProject;


function moveBlock(btn,direction){
 const block=btn.closest('.block');
 const parent=block.parentNode;
 if(direction<0 && block.previousElementSibling){
   parent.insertBefore(block, block.previousElementSibling);
 }
 if(direction>0 && block.nextElementSibling){
   parent.insertBefore(block.nextElementSibling, block);
 }
}
window.moveBlock=moveBlock;
