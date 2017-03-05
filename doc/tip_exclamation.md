# JS中!, !!, !!! 的使用
```
227         debug ("undefined expire", expire, "!expire", !expire, "!!expire", !!expire, "!!!expire", !!!expire);
228         expire = null;
229         debug ("null expire", expire, "!expire", !expire, "!!expire", !!expire, "!!!expire", !!!expire);
230         expire = 0;
231         debug ("0 expire", expire, "!expire", !expire, "!!expire", !!expire, "!!!expire", !!!expire);
232         expire = "";
233         debug ("\"\" expire", expire, "!expire", !expire, "!!expire", !!expire, "!!!expire", !!!expire);
234         expire = 1;
235         debug ("1 expire", expire, "!expire", !expire, "!!expire", !!expire, "!!!expire", !!!expire);
236         expire = "11";
237         debug ("\"11\" expire", expire, "!expire", !expire, "!!expire", !!expire, "!!!expire", !!!expire);
238         expire = {};
239         debug ("{} expire", expire, "!expire", !expire, "!!expire", !!expire, "!!!expire", !!!expire);
240         expire = {a:'a'};
241         debug ("{a} expire", expire, "!expire", !expire, "!!expire", !!expire, "!!!expire", !!!expire);
结果：
  app:server:apis undefined expire +18s undefined !expire true !!expire false !!!expire true
  app:server:apis null expire +0ms      null      !expire true !!expire false !!!expire true
  app:server:apis 0 expire +0ms         0         !expire true !!expire false !!!expire true
  app:server:apis "" expire +0ms                  !expire true !!expire false !!!expire true
  app:server:apis 1 expire +0ms         1         !expire false !!expire true !!!expire false
  app:server:apis "11" expire +0ms      11        !expire false !!expire true !!!expire false
  app:server:apis {} expire +0ms        {}        !expire false !!expire true !!!expire false
  app:server:apis {a} expire +16ms     { a: 'a' } !expire false !!expire true !!!expire false
```


