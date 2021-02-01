const bluesPresenter = new BluesPresenter();
window.addEventListener("load", function(){
    console.log("on");
    bluesPresenter.on();
});
window.addEventListener("unload", function(){
    console.log("off");
    bluesPresenter.off();
});

