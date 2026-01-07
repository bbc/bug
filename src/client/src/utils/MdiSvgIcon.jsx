export default function MdiSvgIcon({ path, size = 24, color = 'currentColor', ...props }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={color}
            {...props}
        >
            <path d={path} />
        </svg>
    );
}