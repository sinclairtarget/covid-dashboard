# Design Rationale
This data visualization is meant for a historian. There are so many different
COVID visualizations out there right now that are meant to give a picture of
how the pandemic is developing at this instant, but I thought it would be a fun
exercise to imagine what a future historian would need to understand this wild
year.

A historian writing a narrative about 2020 would want to know where the
outbreak was worst at different times throughout the year. That's what my
visualization attempts to show at a state-by-state level.

What does "worst" mean in this context? It could mean several things. It could
mean the state with the largest number of cumulative cases. But that doesn't
capture where the virus is growing fastest at a particular time. It could mean
the state with the largest absolute number of daily new cases, but this is
likely to be populous states like California and New York throughout 2020,
which isn't quite right either.

I wanted to try and capture which states were being talked about the most in
the news, which states were generating the most concern nationally. I decided
the best measure for that was the daily number of new cases _per capita_, which
normalizes for state population and is a better naive measure of where the
virus is spreading the fastest. (I am no epidemiologist, and I'm sure
there are more sophisticated ways to measure rate of spread.)

I also decided that I wanted my visualization to incorporate national
cumulative cases numbers for context. I wanted my hypothetical historian to be
able to tell, at a glance, that at such and such stage in the virus' progress
through the United States, New York, say, or Rhode Island, was where the virus
seemed to be spreading fastest and generating the most concern.

## Technical Approach
I chose not to use an SPA framework like Angular because that seemed too heavy
for just a single visualization. There weren't any visual components that I was
planning on reusing across multiple pages and I didn't need support for routing
or anything like that. Plain JavaScript and D3 were enough for my
purposes.

I used Pandas to analyze the New York Times' case numbers and find a state
leader in per-capita daily cases for each week-long period since the beginning
of the pandemic in the US. One of the trickier issues here was figuring out how
to "smooth over" states that were leaders for only a day or two. I thought my
visualization would be too cluttered if I did not do this smoothing. I chose to
find the modal leading state for each week-long period, but in retrospect I
could probably have gotten away with a three-day period.

## Future Work
If I were to spend more time on this, I would first put some effort into making
it mobile-friendly. That's not something I worried about at all.

I would also then spend some time thinking about what to do about the earlier
periods in the graph from January through about March. It's a little bit
confusing when you mouse over these parts of the graph because there is a state
leader but the number of daily cases is zero. I waasn't able to come up with a
clever way of communicating that the state is the leader for the week-long
period based on a single case at some point during the week, even if on a
particular given day there may have been zero daily cases.
