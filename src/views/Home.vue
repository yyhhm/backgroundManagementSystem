<template>
    <div>
        <el-container>
            <div class="nav">
                <div class="bmsName">网上书店后台管理系统</div>
                <el-menu
                    router
                    unique-opened
                    :default-active="$route.path"
                    background-color="#35373f"
                    text-color="#fff"
                    active-text-color="#78ffe9"
                >
                    <el-submenu index="1">
                        <template #title>
                            <span>首页配置</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="/swiper">
                                <i class="el-icon-picture" />轮播图配置
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="2">
                        <template #title>
                            <span>模块管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="/category"
                                ><i class="el-icon-menu" />分类管理</el-menu-item
                            >
                            <el-menu-item index="/book"
                                ><i class="el-icon-reading" />图书管理</el-menu-item
                            >
                            <el-menu-item index="/user"
                                ><i class="el-icon-user-solid" />会员管理</el-menu-item
                            >
                            <el-menu-item index="/order"
                                ><i class="el-icon-s-order" />订单管理</el-menu-item
                            >
                            <el-menu-item index="/appraise"
                                ><i class="el-icon-chat-dot-round" />评价管理</el-menu-item
                            >
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="3">
                        <template #title>
                            <span>系统管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="/account"
                                ><i class="el-icon-lock" />修改账户</el-menu-item
                            >
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </div>
            <el-container class="main">
                <el-header class="el-header">
                    <Header></Header>
                </el-header>

                <el-main class="el-main">
                    <router-view> </router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import Header from '../components/Header.vue'
export default {
    name: 'Home',
    components: {
        Header,
    },
}
</script>

<style scoped>
.nav {
    background-color: #35373f;
    color: white;
}

.bmsName {
    width: 200px;
    height: 50px;
    text-align: center;
    line-height: 50px;
}
.el-menu {
    border: 0px;
    width: 200px;
    height: calc(100vh - 50px);
}
.el-header {
    height: 50px !important;
}
.el-main {
    background-color: #fff;
    height: calc(100vh - 50px);
}
</style>
