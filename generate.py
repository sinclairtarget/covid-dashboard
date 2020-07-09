import sys
import pandas as pd
import IPython

def load_pop_df():
    pop_df = pd.read_csv('data/ACSDT1Y2018.B01003_data_with_overlays_2020-07-03T170627.csv',
                         header=1)

    # Extract two-character state FIPS
    pop_df['fips'] = pop_df.apply(lambda r: r.id[-2:], axis=1)

    pop_df = pop_df.rename(columns={ 'Estimate!!Total': 'population' })
    return pop_df[['fips', 'population']]


def load_state_cases_df():
    state_cases_df = pd.read_csv('data/us-states.csv',
                                 parse_dates=['date'],
                                 dtype={ 'fips': str })

    # Calculate daily cases
    state_cases_df = state_cases_df.sort_values(['state', 'date'])
    state_cases_df['daily_cases'] = (
        state_cases_df.cases
                      .diff()
                      .fillna(0)
                      .astype(int)
    )

    # Fix starting value for each state
    mask = state_cases_df.state != state_cases_df.shift(1).state
    state_cases_df.loc[mask, 'daily_cases'] = 0

    return state_cases_df.reset_index(drop=True)


def load_national_cases_df():
    national_cases_df = pd.read_csv('data/us.csv',
                                    parse_dates=['date'])
    return national_cases_df


pop_df = load_pop_df()
state_cases_df = load_state_cases_df()
national_cases_df = load_national_cases_df()

# Join on FIPS code and calculate per-capita cases
state_cases_df = pd.merge(pop_df, state_cases_df, how='inner', on='fips')
state_cases_df['daily_cases_per_cap'] = state_cases_df.apply(
    lambda r: r.daily_cases / r.population,
    axis=1
)

# Convert to cases per 100,000
state_cases_df['daily_cases_per_cap'] = \
        (state_cases_df.daily_cases_per_cap * 100000).round().astype(int)

# Find daily cases per-capita leader for each day
leaders_df = (
    state_cases_df.sort_values('daily_cases_per_cap', ascending=False)
                  .groupby('date')
                  .first()
)

# Join with national cases
df = pd.merge(national_cases_df, leaders_df, how='left', on='date',
              suffixes=('_national', ''))

df = df.rename(columns={ 'fips': 'leader_fips',
                         'state': 'leader_name',
                         'daily_cases': 'leader_daily_cases',
                         'daily_cases_per_cap': 'leader_daily_cases_per_cap'})
df[['date',
    'cases_national',
    'leader_name',
    'leader_fips',
    'leader_daily_cases',
    'leader_daily_cases_per_cap']].to_json(sys.stdout, orient='records',
                                           indent=2, date_format='iso')
