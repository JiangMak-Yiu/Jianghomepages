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

    // 将域名检测相关代码移到全局作用域
    const domains = [
        'wz.wzfei.xyz',
        'wz.hnwzys.us.kg',
        'wz.wzfei.xyz',
        'wz.wzys2025.us.kg',
        'wz.wzys2088.cf',
        'wz.wzys2088.gq',
        'wz.wzys2088.tk',
        'wz.wzysa.fun',
        'wz.wzys.us.kg'
    ];

    let availableDomain = null;

    async function checkDomain(domain) {
        const startTime = performance.now();
        try {
            const response = await fetch(`https://${domain}/`, {
                mode: 'no-cors',
                cache: 'no-store',
                timeout: 5000
            });
            const endTime = performance.now();
            // no-cors 模式下，只要没有抛出错误就认为域名可用
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

    async function findFirstAvailableDomain() {
        const siteTitle = document.querySelector('#wzys-link .site-title');
        const link = document.querySelector('#wzys-link');
        
        if (availableDomain) {
            return availableDomain;
        }
        
        siteTitle.textContent = '蚊子影视 (检测中...)';
        
        try {
            // 创建所有检测Promise
            const promises = domains.map(async domain => {
                const result = await checkDomain(domain);
                if (result.status === 'success') {
                    return result;
                }
                throw new Error(`Domain ${domain} failed`);
            });

            // 使用 Promise.any 等待第一个成功的结果
            const result = await Promise.any(promises);
            
            availableDomain = result.domain;
            siteTitle.textContent = `蚊子影视 (${Math.round(result.delay)}ms)`;
            link.href = `https://${result.domain}`;
            return result.domain;
        } catch (error) {
            siteTitle.textContent = '蚊子影视 (无可用线路)';
            console.error('所有域名检测失败:', error);
            return null;
        }
    }

    // 开始域名检测
    findFirstAvailableDomain();

    // 点击事件处理
    document.querySelector('#wzys-link').addEventListener('click', async (e) => {
        e.preventDefault();
        
        // 如果已有可用域名，直接使用
        if (availableDomain) {
            window.open(`https://${availableDomain}`, '_blank');
            return;
        }
        
        // 否则重新检测
        const domain = await findFirstAvailableDomain();
        if (domain) {
            window.open(`https://${domain}`, '_blank');
        } else {
            console.error('无法找到可用域名');
        }
    });
}); 