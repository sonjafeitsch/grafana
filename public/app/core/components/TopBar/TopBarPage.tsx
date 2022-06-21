import { css, cx } from '@emotion/css';
import React, { PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import { useObservable, useToggle } from 'react-use';

import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import { getNavModel } from 'app/core/selectors/navModel';
import { StoreState } from 'app/types';

import { PageToolbar } from './PageToolbar';
import { topBarDefaultProps, topBarUpdates } from './TopBarUpdate';
import { TopSearchBar } from './TopSearchBar';
import { TOP_BAR_LEVEL_HEIGHT } from './types';

export interface Props extends PropsWithChildren<{}> {
  navId?: string;
}

export function TopBarPage({ children, navId }: Props) {
  const styles = useStyles2(getStyles);
  const [searchBarHidden, toggleSearchBar] = useToggle(false); // repace with local storage
  const props = useObservable(topBarUpdates, topBarDefaultProps);
  const navModel = useSelector((state: StoreState) => getNavModel(state.navIndex, navId ?? 'home'));

  return (
    <div className={styles.viewport}>
      <div className={styles.topBar}>
        {!searchBarHidden && <TopSearchBar />}
        <PageToolbar
          {...props}
          searchBarHidden={searchBarHidden}
          onToggleSearchBar={toggleSearchBar}
          pageNavItem={navModel.node}
        />
      </div>
      <div className={cx(styles.content, searchBarHidden && styles.contentNoSearchBar)}>{children}</div>
    </div>
  );
}

const getStyles = (theme: GrafanaTheme2) => {
  const shadow = theme.isDark
    ? `0 0.6px 1.5px rgb(0 0 0), 0 2px 4px rgb(0 0 0 / 40%), 0 5px 10px rgb(0 0 0 / 23%)`
    : '0 0.6px 1.5px rgb(0 0 0 / 8%), 0 2px 4px rgb(0 0 0 / 6%), 0 5px 10px rgb(0 0 0 / 5%)';

  return {
    viewport: css({
      display: 'flex',
      flexGrow: 1,
      height: '100%',
    }),
    content: css({
      display: 'flex',
      paddingTop: TOP_BAR_LEVEL_HEIGHT * 2 + 16,
      flexGrow: 1,
    }),
    contentNoSearchBar: css({
      paddingTop: TOP_BAR_LEVEL_HEIGHT + 16,
    }),
    topBar: css({
      display: 'flex',
      position: 'fixed',
      zIndex: theme.zIndex.navbarFixed,
      left: 0,
      right: 0,
      boxShadow: shadow,
      background: theme.colors.background.primary,
      flexDirection: 'column',
    }),
  };
};
