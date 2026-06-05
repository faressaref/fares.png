
window.addEventListener('scroll',()=>{
const p=document.querySelector('.progress');
if(p){
const h=document.documentElement;
p.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight))*100+'%';
}
});
document.querySelectorAll('.card,.project,.about,.portfolio,.section').forEach(e=>e.classList.add('reveal'));
const obs=new IntersectionObserver(entries=>{
entries.forEach(x=>{if(x.isIntersecting)x.target.classList.add('active');});
},{threshold:.1});
document.querySelectorAll('.reveal').forEach(e=>obs.observe(e));
