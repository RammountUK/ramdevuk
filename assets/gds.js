(function() {
    let $progbar = document.querySelector('.gds-nav .progress-bar');
    let $sectionBtns = document.querySelectorAll('.gds-nav button');
    let currSect = 1;
    let sectionMap;
    $sectionBtns.forEach(el => el.addEventListener('click', (e) => {
        let id = el.dataset.id;
        id = id.replace('#','');
        updateSection(el.dataset.section)
        updateProgress(id);
        document.getElementById(id).scrollIntoView();
    }));
    function buildSectionMap() {
       let sectionMap = {}
       let index = 1;
       var sections = document.querySelectorAll('#fixed-side-menu .section').forEach((el) => {
          let section_id =  el.dataset.id
          let section = document.querySelector(section_id);
          if(section){
            let offset =  sectionOffset(section);
            sectionMap[index] = offset;
            index++;
          }

       });
       return sectionMap

     }
     sectionMap = buildSectionMap();
     function sectionOffset(element){
        var bodyRect = document.body.getBoundingClientRect(),
        elemRect = element.getBoundingClientRect(),
        offset   = elemRect.top - bodyRect.top;
        return offset;
     }

    var startProductBarPos=-1;
    window.onscroll=function(){
      var bar = document.getElementById('fixed-side-menu');
      if(startProductBarPos<0)startProductBarPos=findPosY(bar);

      if(pageYOffset>startProductBarPos){
        bar.classList.add("fixed");
      }else{
        bar.classList.remove("fixed");
      }

    };
    function findPosY(obj) {
      var curtop = -150;
      if (typeof (obj.offsetParent) != 'undefined' && obj.offsetParent) {
        while (obj.offsetParent) {
          curtop += obj.offsetTop;
          obj = obj.offsetParent;
        }
        curtop += obj.offsetTop;
      }
      else if (obj.y)
        curtop += obj.y;
      return curtop;
    }
    function updateProgress(section){
      var winScroll = document.getElementById(section).offsetTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var scrolled = ((winScroll / height) * 100);
      if (scrolled < 20){
        scrolled = 20;
      };
      document.querySelector('.progress-bar').style.height = scrolled + '%';
    }
    window.onwheel = function() {
        var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var scrolled = ((winScroll / height) * 100);
        highlightSection(this.scrollY);
        if (scrolled < 20) return;
        document.querySelector('.progress-bar').style.height = scrolled + '%';
      }
      function highlightSection(scrollY) {
        var point1, point2;
        if (currSect === 1) {
          point1 = sectionMap[2];
          if (scrollY < point1) return;
          currSect++;
          updateSection(currSect);
        } else if (currSect === 5) {
          point1 = sectionMap[4];
          if (scrollY > point1) return;
          currSect--;
          updateSection(currSect);
        } else {
          point1 = sectionMap[currSect - 1];
          point2 = sectionMap[currSect + 1];
          if (scrollY < point1) {
            currSect--;
            updateSection(currSect);
          } else if (scrollY > point2) {
            currSect++;
            updateSection(currSect);
          }
        }
      }
      function updateSection(num) {
        var sections = document.querySelectorAll('#fixed-side-menu .section').forEach((el) => {
           el.classList.remove('grey')
        });
        for (let i = 1; i <= num; i++) {
            let sectionClass = "[data-section='" + i + "']";
            let highlight = document.querySelector(sectionClass);
            highlight.classList.add('grey')
        }
      }

   })();
