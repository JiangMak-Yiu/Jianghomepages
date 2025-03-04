document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const navLinks = document.querySelectorAll('nav a');
    
    // 导航点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(link => link.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // 打字效果
    const roles = ['编程', '公益', '创新', '分享'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedElement = document.querySelector('.typed');
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typedElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(type, newTextDelay);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(type, isDeleting ? erasingDelay : typingDelay);
        }
    }

    // 启动打字效果
    setTimeout(type, newTextDelay);

    // 添加友链部分的显示逻辑
    const sections = document.querySelectorAll('.section');
    
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });
    }

    // 如果有导航链接，添加点击事件
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });

    // 域名检测功能
    const domains = [
        'wz.wzfei.xyz',
        'hnwzys.us.kg',
        'wzfei.xyz',
        'wzys2025.us.kg',
        'wzys2088.cf',
        'wzys2088.gq',
        'wzys2088.tk',
        'wzysa.fun',
        'wzys.us.kg'
    ];

    let fastestDomain = null;  // 存储最快域名

    async function checkDomain(domain) {
        const startTime = performance.now();
        try {
            const response = await fetch(`https://${domain}`, {
                mode: 'no-cors',
                cache: 'no-store'
            });
            const endTime = performance.now();
            return {
                domain,
                delay: endTime - startTime,
                status: 'success'
            };
        } catch (error) {
            return {
                domain,
                delay: Infinity,
                status: 'failed'
            };
        }
    }

    async function findFastestDomain() {
        const siteTitle = document.querySelector('#wzys-link .site-title');
        const link = document.querySelector('#wzys-link');
        
        if (fastestDomain) {  // 如果已有检测结果，直接返回
            return fastestDomain;
        }
        
        siteTitle.textContent = '蚊子影视 (检测中...)';
        
        try {
            const results = await Promise.all(domains.map(domain => checkDomain(domain)));
            const fastest = results
                .filter(result => result.status === 'success')
                .sort((a, b) => a.delay - b.delay)[0];
            
            if (fastest) {
                fastestDomain = fastest.domain;  // 保存检测结果
                siteTitle.textContent = `蚊子影视 (${Math.round(fastest.delay)}ms)`;
                link.href = `https://${fastest.domain}`;
                return fastest.domain;
            } else {
                siteTitle.textContent = '蚊子影视 (无可用线路)';
                return null;
            }
        } catch (error) {
            siteTitle.textContent = '蚊子影视 (检测失败)';
            return null;
        }
    }

    document.addEventListener('DOMContentLoaded', findFastestDomain);

    document.querySelector('#wzys-link').addEventListener('click', async (e) => {
        e.preventDefault();
        if (fastestDomain) {
            window.open(`https://${fastestDomain}`, '_blank');
        } else {
            const domain = await findFastestDomain();
            if (domain) {
                window.open(`https://${domain}`, '_blank');
            }
        }
    });
}); 