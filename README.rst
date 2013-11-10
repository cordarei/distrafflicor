=============
DistrAffliCor
=============

Overview
========

The name is inspired by (read “shamelessly ripped off of”) Randall
Monroe’s blog post here__, while the idea is similar in spirit but
different in implementation. Randall implemented his system simply by
physically shutting down his computer. It’s a nifty idea, and seems like
it would probably work, if only I didn’t have so many excuses for not
trying it. My problem is more that I sometimes get sucked into reading
more and more about something that is *really interesting* that **never
ends**! Until I’ve been reduced to a husk, a shell of my former self.
Well, I have the other problem too.

__ http://blog.xkcd.com/2011/02/18/distraction-affliction-correction-extensio/

Anyway, what I want and have not been able to find exactly is a Chrome
extension that will regulate how much time I can spend on the web *at
one time*.  Not total for one day, and not limited to blacklisted
websites. I want for a timer to trip when I have been reading any sites
(possibly excluding whitelisted sites from the timer) for XX minutes and
for the extension to block all sites after that for YY minutes. The YY
minutes is similar to the delay in Randall’s system, but since it is an
involuntary interruption rather than a delay inserted between action and
reward, it isn’t the same thing and will most likely not have the same
effects. Like I said above, my *worst* problem is that once I’ve started
reading something I can’t stop.

Actually, some Pomodoro extensions do *almost* this, but they require
manually clicking the timer to switch states. I actually use the `Strict
Workflow`_ extension, and it works great—when I remember and am in the
mood to click it to start the timer. And anyway, it’s backward to what I
want, which is something that will let me get on the web, give me enough
time to make progress on something (if I’m doing research etc) and then
kick me off to pull me out of the Wikipedia vortex (oh, Wikipedia).

.. _`Strict Workflow`: https://chrome.google.com/webstore/detail/strict-workflow/cgmnfnmlficgeijcalkgnnkigkefkbhd


Todo
====

The core functionality is mostly done, with the exception of
whitelisting URLs. I need to code an options page, and get some icons.


License
=======

All files copyright © 2013 Joseph Irwin unless specifically stated
otherwise.

This software is distributed under the terms of the MIT License. See the
`LICENSE <LICENSE>`_ file for the text of the license.
