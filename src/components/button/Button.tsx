import styles from './Button.module.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  bgColor?: 'fill' | 'line';
  btnSize?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ children, type = 'button', btnSize = 'lg', bgColor = 'fill', ...rest }) => {
  const bgColors = styles[bgColor || 'fill' || 'line'];
  const btnSizes = styles[btnSize || 'sm' || 'lg'];

  return (
    <button className={`${bgColors} ${btnSizes} ${styles.button}`} type={type} {...rest}>
      {children}
    </button>
  );
};

export default Button;
