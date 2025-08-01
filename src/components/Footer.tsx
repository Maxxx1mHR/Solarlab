import {Flex} from 'antd';
import {Footer as FooterAnt} from 'antd/es/layout/layout';
import Link from 'antd/es/typography/Link';
import Logo from '../assets/img/solarlab-logo.svg?react';
import styles from './styles.module.scss';
export const Footer = () => {
  return (
    <FooterAnt>
      <Flex vertical align='center'>
        <Link href='https://solarlab.ru/' target='_blank'>
          <Logo className={styles.link} />
        </Link>
        <Link href='https://t.me/mvpudeev' target='_blank' className={styles.link}>
          mvpudeev
        </Link>
      </Flex>
    </FooterAnt>
  );
};
