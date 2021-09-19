d = new Date(); p = new Date(d.getTime() + 0*86400000);
monthA = 'января ,февраля,марта,апреля,мая,июня,июля,августа,сентября,октября,ноября,декабря'.split(',');
document.write(p.getDate() - 0 + ' ' + monthA[p.getMonth()] + ' '+p.getFullYear());