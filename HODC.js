setTimeout(() => {
const pages = {};
let current_page, current_zombies;
let current_id = 0;
const start = i => {
  current_page = i;
  current_id += 1;
  if (pages[i]) {
    $('pre.active').removeClass('active');
    $("#stage-num").html(i);
    $("#stage-time").html(pages[i]['time']);
    current_zombies = pages[i]['zombies'].concat();
    current_num = current_zombies.length;
    $('pre.stage').addClass('active');
    setTimeout(() => {
      $('pre.active').removeClass('active');
      $(`[data-page="${i}"]`).addClass('active');
      const action_id = current_id;
      setTimeout(() => {
        if (action_id === current_id && current_zombies.length > 0) {
          current_id += 1;
          $('pre.active').removeClass('active');
          $('pre.dead').addClass('active');
        }
      }, pages[i]['time'] * 1000);
    }, 1500);
  } else {
    $('pre.active').removeClass('active');
    $('pre.complete').addClass('active');
  }
}
$('[data-page]').each(function() {
  pages[Number($(this).attr('data-page'))] = {
    zombies: $(this).attr('data-zombie').split(',').map( s => `"${s} Am I dead?"`),
    time: Number($(this).attr('data-time')),
  };
  $(this).find('span.token.string').each(function() {
    if (/?"$/.test($(this).html())) {
      $(this).html($(this).html().replace("?", "Am I dead?"))
      $(this).click(function () {
        const action_id = current_id;
        const s = $(this).html();
        if (/Am I dead\?"$/.test(s)) {
          const i = current_zombies.indexOf(s)
          if (i > -1) {
            current_zombies.splice(i, 1);
            const $this = $(this);
            $this.attr('data-org-code', $(this).html());
            $this.html('"??"');
            setTimeout(() => {
              if (action_id === current_id) { // 2週目の考慮はしない
                if ($this.html() === '"??"') {
                  $this.html('"?"');
                  setTimeout(() => {
                    if (action_id === current_id) { // 2週目の考慮はしない
                      current_num += -1;
                      if (current_num === 0) {
                        start(current_page + 1);
                      }
                    }
                  }, 400);
                }
              }
            }, 400);
          } else {
            current_id += 1;
            $('pre.active').removeClass('active');
            $('pre.miss').addClass('active');
          }
        }
      });
    }
  });
});
$(".retry").click(function() {
  $('pre.active').removeClass('active');
  $('pre.top').addClass('active');
});
$("#start").click(function() {
  $('[data-org-code]').each(function() {
    $(this).html($(this).attr('data-org-code'))
  });
  start(1)
});
$('pre.top').addClass('active');
}, 200); // prism.jsのマークアップを待受

