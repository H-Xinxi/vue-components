<template>
  <div class="edit_markdown_container">
    <div class="edit_markdown_left">
      <div class="left_top">
        <div class="back_botton" @click="backPage">
          <el-icon class="back_icon">
            <ArrowLeftBold />
          </el-icon>
          <span>返回</span>
        </div>
        <div class="save_text">
          <div class="save_icon">
            <svg
              t="1725586880356"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="723"
              width="20"
              height="20"
            >
              <path
                d="M845.821652 513.898805C832.868686 355.979645 700.200697 231.42391 539.000961 231.42391c-143.080937 0-266.480681 92.845015-302.133509 223.898681h-5.725767C138.545028 455.322591 63.218239 530.64938 63.218239 623.246038c0 92.598915 75.326789 167.923447 167.923446 167.923446h587.733193c77.15786 0 139.935829-62.782484 139.935829-139.935829 0-67.943802-48.678044-124.743132-112.989055-137.33485z m-26.946774 221.295445H231.141685c-61.728095 0-111.948212-50.220117-111.948211-111.948212s50.222375-111.95047 111.948211-111.95047h27.987618a27.992133 27.992133 0 0 0 27.508965-22.808237c21.891573-116.524761 128.034996-201.090444 252.362693-201.090444 138.885955 0 251.886299 113.000344 251.886299 251.886299 0 15.443313 12.544305 27.987617 27.987618 27.987617 46.300586 0 83.962852 37.664524 83.962852 83.962852-0.002258 46.298329-37.664524 83.960594-83.962852 83.960595z"
                fill="#ffffff"
                p-id="724"
              ></path>
              <path
                d="M603.174247 463.520642l-120.14852 120.134974-64.173286-64.159739c-10.934498-10.925466-28.644636-10.925466-39.576875 0-10.93224 10.934498-10.93224 28.644636 0 39.574617l83.962852 83.962853a27.883759 27.883759 0 0 0 19.787309 8.200308c7.159466 0 14.321189-2.731931 19.789566-8.200308l139.935829-139.93583c10.93224-10.927724 10.93224-28.644636 0-39.576875-10.93224-10.925466-28.642378-10.925466-39.576875 0z"
                fill="#ffffff"
                p-id="725"
              ></path>
            </svg>
          </div>
          <span>已保存</span>
        </div>
        <div class="operation_button">
          <el-tooltip
            class="box-item"
            effect="light"
            content="撤销"
            placement="bottom"
          >
            <el-icon>
              <RefreshLeft />
            </el-icon>
          </el-tooltip>
          <el-tooltip
            class="box-item"
            effect="light"
            content="恢复"
            placement="bottom"
          >
            <el-icon>
              <RefreshRight />
            </el-icon>
          </el-tooltip>
        </div>
      </div>
      <div class="left_content">
        <div
          class="ppt_title"
          contenteditable="true"
          @input="changeTitle($event)"
          placeholder="请输入演讲标题"
          @select="selectTitle()"
        >
          {{ pptTitie }}
        </div>
        <div class="ppt_add_content" @click="addContent($event)">
          <div
            class="ppt_add_content_item"
            data-type="subtitle"
            v-if="!isSubheading"
          >
            + 副标题
          </div>
          <div
            class="ppt_add_content_item"
            data-type="speaker"
            v-if="!isSpeaker"
          >
            + 演讲者
          </div>
          <div
            class="ppt_add_content_item"
            data-type="time"
            v-if="!isSpeakingTime"
          >
            + 演讲时间
          </div>
          <div
            class="ppt_add_content_item"
            data-type="logo"
            v-if="!isLogoImageUrl"
          >
            + Logo
          </div>
        </div>
        <div
          class="ppt_title_text_box"
          v-if="isSubheading || isSpeaker || isSpeakingTime || isLogoImageUrl"
        >
          <div class="ppt_title_text_box_item" v-if="isSubheading">
            <span class="title_item_span">副标题:</span>
            <input
              type="text"
              placeholder="请输入副标题"
              autocomplete="off"
              class="title_item_input"
              v-model="subheading"
              @input="changeSubheading"
            />
            <el-icon class="title_item_icon" @click="removeContetn('subtitle')">
              <Close />
            </el-icon>
          </div>
          <div class="ppt_title_text_box_item" v-if="isSpeaker">
            <span class="title_item_span">演讲者:</span>
            <input
              type="text"
              placeholder="请输入演讲者"
              autocomplete="off"
              class="title_item_input"
              v-model="speaker"
              @input="changeSpeaker"
            />
            <el-icon class="title_item_icon" @click="removeContetn('speaker')">
              <Close />
            </el-icon>
          </div>
          <div class="ppt_title_text_box_item" v-if="isSpeakingTime">
            <span class="title_item_span">演讲时间:</span>
            <input
              type="text"
              placeholder="请输入演讲时间"
              autocomplete="off"
              class="title_item_input"
              v-model="speakingTime"
              @input="changeSpeakingTime"
            />
            <el-icon class="title_item_icon" @click="removeContetn('time')">
              <Close />
            </el-icon>
          </div>
          <div
            class="ppt_title_text_box_item logochangecon"
            v-if="isLogoImageUrl"
          >
            <div style="display: flex; align-items: center">
              <span class="title_item_span">Logo:</span>
              <el-upload
                class="upload_logo"
                action=""
                :show-file-list="false"
                :http-request="imgUploadRequest"
                :before-upload="imgBeforeUpload"
              >
                <img v-if="logoImageUrl" :src="logoImageUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
              <el-icon class="title_item_icon" @click="removeContetn('logo')">
                <Close />
              </el-icon>
            </div>
            <div style="margin-top: 10px"></div>
          </div>
        </div>
        <!-- markdown渲染内容 -->
        <div v-if="markdownTextData.length > 1" class="ppt_content_box">
          <div
            v-for="(item, index) in markdownTextData"
            :key="index"
            class="item_box"
          >
            <div v-if="index > 0">
              <div class="title_box">
                <div class="icon_container">
                  <div style="display: flex">
                    <el-dropdown trigger="click">
                      <el-icon class="icon_add icon_mouse">
                        <Plus />
                      </el-icon>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item @click="addMarkdownTextData(index)"
                            >添加节点</el-dropdown-item
                          >
                          <el-dropdown-item
                            @click="addMarkdownChildrenText(index)"
                            >添加子节点</el-dropdown-item
                          >
                          <el-dropdown-item
                            @click="addUpMarkdownTextData(index)"
                            >向上添加节点</el-dropdown-item
                          >
                          <el-dropdown-item @click="deleteMarkdownText(index)"
                            >删除节点</el-dropdown-item
                          >
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                    <div v-if="item.children?.length > 0">
                      <el-icon
                        class="icon_mouse"
                        v-if="!isItemInArray('two' + index)"
                        @click="addOnunfold('two' + index)"
                      >
                        <CaretBottom />
                      </el-icon>
                      <el-icon
                        class="icon_mouse"
                        v-else
                        @click="removeOnunfold('two' + index)"
                      >
                        <CaretRight />
                      </el-icon>
                    </div>
                  </div>

                  <div class="icon_circle icon_mouse">
                    <svg
                      t="1725519306118"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="2614"
                      width="20"
                      height="18"
                    >
                      <path
                        d="M480 480m-288 0a4.5 4.5 0 1 0 576 0 4.5 4.5 0 1 0-576 0Z"
                        p-id="2615"
                        fill="#ffffff"
                      ></path>
                    </svg>
                  </div>
                </div>
                <!-- 二级标题 -->
                <div
                  contenteditable="true"
                  class="two_title_text all_content"
                  textType="text"
                  @input="editText($event, index)"
                >
                  {{ item.text }}
                </div>
              </div>

              <!-- 二级标题的内容 -->
              <div v-if="!isItemInArray('two' + index)" class="border_style">
                <div
                  v-for="(item2, index2) in item.children"
                  :key="index2"
                  class="two_title_content"
                >
                  <div class="title_box">
                    <div class="icon_container">
                      <div style="display: flex">
                        <el-dropdown trigger="click">
                          <el-icon class="icon_add icon_mouse">
                            <Plus />
                          </el-icon>
                          <template #dropdown>
                            <el-dropdown-menu>
                              <el-dropdown-item
                                @click="addMarkdownTextData(index, index2)"
                                >添加节点</el-dropdown-item
                              >
                              <el-dropdown-item
                                @click="addMarkdownChildrenText(index, index2)"
                                >添加子节点</el-dropdown-item
                              >
                              <el-dropdown-item
                                @click="addUpMarkdownTextData(index, index2)"
                                >向上添加节点</el-dropdown-item
                              >
                              <el-dropdown-item
                                @click="deleteMarkdownText(index, index2)"
                                >删除节点</el-dropdown-item
                              >
                            </el-dropdown-menu>
                          </template>
                        </el-dropdown>
                        <div v-if="item2.children?.length > 0">
                          <el-icon
                            class="icon_mouse"
                            v-if="!isItemInArray('three' + index2)"
                            @click="addOnunfold('three' + index2)"
                          >
                            <CaretBottom />
                          </el-icon>
                          <el-icon
                            class="icon_mouse"
                            v-else
                            @click="removeOnunfold('three' + index2)"
                          >
                            <CaretRight />
                          </el-icon>
                        </div>
                        <!-- <el-icon><CaretRight /></el-icon> -->
                      </div>

                      <div class="icon_circle icon_mouse">
                        <svg
                          t="1725519306118"
                          class="icon"
                          viewBox="0 0 1024 1024"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          p-id="2614"
                          width="20"
                          height="18"
                        >
                          <path
                            d="M480 480m-288 0a4.5 4.5 0 1 0 576 0 4.5 4.5 0 1 0-576 0Z"
                            p-id="2615"
                            fill="#ffffff"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <!-- 三级标题 -->
                    <div
                      contenteditable="true"
                      class="all_content all_title"
                      textType="text"
                      @input="editText($event, index, index2)"
                    >
                      {{ item2.text }}
                    </div>
                  </div>

                  <!-- 三级副标题 -->
                  <div
                    contenteditable="true"
                    class="three_title_subText all_content"
                    textType="subText"
                    @input="editText($event, index, index2)"
                  >
                    {{ item2.subText }}
                  </div>
                  <!-- 三级标题的内容 -->
                  <div
                    v-if="!isItemInArray('three' + index2)"
                    class="border_style"
                  >
                    <div
                      v-for="(item3, index3) in item2.children"
                      :key="index3"
                      class="three_title_content"
                    >
                      <div class="title_box">
                        <div class="icon_container">
                          <div style="display: flex">
                            <el-dropdown trigger="click">
                              <el-icon class="icon_add icon_mouse">
                                <Plus />
                              </el-icon>
                              <template #dropdown>
                                <el-dropdown-menu>
                                  <el-dropdown-item
                                    @click="
                                      addMarkdownTextData(index, index2, index3)
                                    "
                                    >添加节点</el-dropdown-item
                                  >
                                  <el-dropdown-item
                                    @click="
                                      addMarkdownChildrenText(
                                        index,
                                        index2,
                                        index3
                                      )
                                    "
                                    >添加子节点</el-dropdown-item
                                  >
                                  <el-dropdown-item
                                    @click="
                                      addUpMarkdownTextData(
                                        index,
                                        index2,
                                        index3
                                      )
                                    "
                                    >向上添加节点</el-dropdown-item
                                  >
                                  <el-dropdown-item
                                    @click="
                                      deleteMarkdownText(index, index2, index3)
                                    "
                                    >删除节点</el-dropdown-item
                                  >
                                </el-dropdown-menu>
                              </template>
                            </el-dropdown>
                            <div v-if="item3.children?.length > 0">
                              <el-icon
                                class="icon_mouse"
                                v-if="!isItemInArray('four' + index3)"
                                @click="addOnunfold('four' + index3)"
                              >
                                <CaretBottom />
                              </el-icon>
                              <el-icon
                                class="icon_mouse"
                                v-else
                                @click="removeOnunfold('four' + index3)"
                              >
                                <CaretRight />
                              </el-icon>
                            </div>
                            <!-- <el-icon><CaretRight /></el-icon> -->
                          </div>

                          <div class="icon_circle icon_mouse">
                            <svg
                              t="1725519306118"
                              class="icon"
                              viewBox="0 0 1024 1024"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              p-id="2614"
                              width="20"
                              height="18"
                            >
                              <path
                                d="M480 480m-288 0a4.5 4.5 0 1 0 576 0 4.5 4.5 0 1 0-576 0Z"
                                p-id="2615"
                                fill="#ffffff"
                              ></path>
                            </svg>
                          </div>
                        </div>
                        <!-- 四级标题 -->
                        <div
                          contenteditable="true"
                          class="all_content all_title"
                          textType="text"
                          @input="editText($event, index, index2, index3)"
                        >
                          {{ item3.text }}
                        </div>
                      </div>

                      <!-- 四级副标题 -->
                      <div
                        contenteditable="true"
                        class="all_content all_subText"
                        textType="subText"
                        @input="editText($event, index, index2, index3)"
                      >
                        {{ item3.subText }}
                      </div>
                      <!-- 四级标题的内容 -->
                      <div
                        v-if="!isItemInArray('four' + index3)"
                        class="border_style"
                      >
                        <div
                          v-for="(item4, index4) in item3.children"
                          :key="index4"
                          class="three_title_content"
                        >
                          <div class="title_box">
                            <div class="icon_container">
                              <div style="display: flex">
                                <el-dropdown trigger="click">
                                  <el-icon class="icon_add icon_mouse">
                                    <Plus />
                                  </el-icon>
                                  <template #dropdown>
                                    <el-dropdown-menu>
                                      <el-dropdown-item
                                        @click="
                                          addMarkdownTextData(
                                            index,
                                            index2,
                                            index3,
                                            index4
                                          )
                                        "
                                        >添加节点</el-dropdown-item
                                      >
                                      <el-dropdown-item
                                        @click="
                                          addMarkdownChildrenText(
                                            index,
                                            index2,
                                            index3,
                                            index4
                                          )
                                        "
                                        >添加子节点</el-dropdown-item
                                      >
                                      <el-dropdown-item
                                        @click="
                                          addUpMarkdownTextData(
                                            index,
                                            index2,
                                            index3,
                                            index4
                                          )
                                        "
                                        >向上添加节点</el-dropdown-item
                                      >
                                      <el-dropdown-item
                                        @click="
                                          deleteMarkdownText(
                                            index,
                                            index2,
                                            index3,
                                            index4
                                          )
                                        "
                                        >删除节点</el-dropdown-item
                                      >
                                    </el-dropdown-menu>
                                  </template>
                                </el-dropdown>
                                <div v-if="item4.children?.length > 0">
                                  <el-icon
                                    class="icon_mouse"
                                    v-if="!isItemInArray('five' + index4)"
                                    @click="addOnunfold('five' + index4)"
                                  >
                                    <CaretBottom />
                                  </el-icon>
                                  <el-icon
                                    class="icon_mouse"
                                    v-else
                                    @click="removeOnunfold('five' + index4)"
                                  >
                                    <CaretRight />
                                  </el-icon>
                                </div>
                                <!-- <el-icon><CaretRight /></el-icon> -->
                              </div>

                              <div class="icon_circle icon_mouse">
                                <svg
                                  t="1725519306118"
                                  class="icon"
                                  viewBox="0 0 1024 1024"
                                  version="1.1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  p-id="2614"
                                  width="20"
                                  height="18"
                                >
                                  <path
                                    d="M480 480m-288 0a4.5 4.5 0 1 0 576 0 4.5 4.5 0 1 0-576 0Z"
                                    p-id="2615"
                                    fill="#ffffff"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                            <!-- 五级标题 -->
                            <div
                              contenteditable="true"
                              class="all_content all_title"
                              textType="text"
                              @input="
                                editText($event, index, index2, index3, index4)
                              "
                            >
                              {{ item4.text }}
                            </div>
                          </div>

                          <!-- 五级副标题 -->
                          <div
                            contenteditable="true"
                            class="all_content all_subText"
                            textType="subText"
                            @input="
                              editText($event, index, index2, index3, index4)
                            "
                          >
                            {{ item4.subText }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="edit_markdown_right">
      <div class="right_top">
        <el-button type="primary" class="updownLoad_PPT" @click="downloadPPT()"
          >下载ppt</el-button
        >
      </div>
      <div class="right_content_container">
        <div class="right_content_box">
          <div class="right_content">
            <swiper
              class="swiper_div"
              :modules="modules"
              :slides-per-view="1"
              :space-between="50"
              navigation
              :pagination="{ clickable: true }"
              :scrollbar="{ draggable: true }"
              @swiper="onSwiper"
              @slideChange="onSlideChange"
            >
              <swiper-slide
                v-for="(item, index1) of pptDataList"
                :key="item"
                :currentIndex="index1"
                :virtualIndex="index1"
                class="swiper_item"
              >
                <!-- 首页 -->
                <div
                  class="swiper_item_container"
                  v-if="item.type === 'start'"
                  :style="{
                    backgroundImage: `url(${themeObject.cover.backImage})`,
                    color: themeObject.cover.color,
                  }"
                >
                  <div
                    class="text_box"
                    :style="{
                      left: themeObject.cover.title.left,
                      top: themeObject.cover.title.top,
                      width: themeObject.cover.title.width,
                      height: themeObject.cover.title.height,
                      justifyContent: themeObject.cover.textAlign,
                    }"
                    type="title"
                  >
                    <p class="text_container">{{ item.title }}</p>
                  </div>
                  <div
                    class="text_box"
                    :style="{
                      left: themeObject.cover.time.left,
                      top: themeObject.cover.time.top,
                      width: themeObject.cover.time.width,
                      height: themeObject.cover.time.height,
                      justifyContent: themeObject.cover.textAlign,
                    }"
                    type="speakingTime"
                  >
                    <p class="text_container">{{ item.speakingTime }}</p>
                  </div>
                  <div
                    class="text_box"
                    :style="{
                      left: themeObject.cover.spaker.left,
                      top: themeObject.cover.spaker.top,
                      width: themeObject.cover.spaker.width,
                      height: themeObject.cover.spaker.height,
                      justifyContent: themeObject.cover.textAlign,
                    }"
                    type="speaker"
                  >
                    <p class="text_container">{{ item.speaker }}</p>
                  </div>
                  <div
                    class="text_box"
                    :style="{
                      left: themeObject.cover.subTitle.left,
                      top: themeObject.cover.subTitle.top,
                      width: themeObject.cover.subTitle.width,
                      height: themeObject.cover.subTitle.height,
                      justifyContent: themeObject.cover.textAlign,
                    }"
                    type="subTitle"
                  >
                    <p class="text_container">{{ item.subTitle }}</p>
                  </div>
                </div>
                <!-- 目录页 -->
                <div
                  class="swiper_item_container"
                  v-if="item.type === 'catalogue'"
                  :style="{
                    backgroundImage: `url(${themeObject.catalogue.backImage})`,
                  }"
                >
                  <div
                    class="text_box"
                    :style="{
                      left: themeObject.catalogue.catalogueText.left,
                      top: themeObject.catalogue.catalogueText.top,
                      width: themeObject.catalogue.catalogueText.width,
                      height: themeObject.catalogue.catalogueText.height,
                      color: themeObject.catalogue.catalogueText.color,
                      justifyContent: themeObject.catalogue.textAlign,
                    }"
                    type="title"
                  >
                    <p class="text_container">CONTENTS</p>
                  </div>
                  <div
                    class="content_box"
                    :style="{
                      left: themeObject.catalogue.itemBox.left,
                      top: themeObject.catalogue.itemBox.top,
                      width: themeObject.catalogue.itemBox.width,
                      height: themeObject.catalogue.itemBox.height,
                    }"
                  >
                    <div style="position: relative; width: 100%; height: 100%">
                      <div
                        class="text_box"
                        :style="{
                          top:
                            index *
                              (100 / item.content.length >
                              themeObject.catalogue.catalogueItem.maxHeight
                                ? themeObject.catalogue.catalogueItem.maxHeight
                                : 100 / item.content.length) +
                            '%',
                          width: '100%',
                          height: 100 / (item.content.length + 1) + '%',
                          maxHeight: '10%',
                          color: themeObject.catalogue.color,
                          justifyContent: themeObject.catalogue.textAlign,
                        }"
                        v-for="(catalogueItem, index) of item.content"
                        :key="index"
                        type="item"
                      >
                        <p class="text_container">{{ catalogueItem }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 过渡页 -->
                <div
                  class="swiper_item_container"
                  v-if="item.type === 'transition'"
                  :style="{
                    backgroundImage: `url(${themeObject.transition.backImage})`,
                  }"
                >
                  <div
                    class="text_box"
                    :style="{
                      left: themeObject.transition.transitionText.left,
                      top: themeObject.transition.transitionText.top,
                      width: themeObject.transition.transitionText.width,
                      height: themeObject.transition.transitionText.height,
                      color: themeObject.transition.color,
                      justifyContent: themeObject.catalogue.textAlign,
                    }"
                    type="text"
                  >
                    <p class="text_container">{{ item.text }}</p>
                  </div>
                  <div
                    class="text_box"
                    :style="{
                      left: themeObject.transition.transitionSubText.left,
                      top: themeObject.transition.transitionSubText.top,
                      width: themeObject.transition.transitionSubText.width,
                      height: themeObject.transition.transitionSubText.height,
                      color: themeObject.transition.color,
                      justifyContent: themeObject.transition.textAlign,
                    }"
                    type="subText"
                  >
                    <p class="text_container">{{ item.subText }}</p>
                  </div>
                </div>

                <!-- 内容页 -->
                <div
                  class="swiper_item_container"
                  v-if="item.type === 'content'"
                  :style="{
                    backgroundImage: `url(${themeObject.content.backImage})`,
                  }"
                >
                  <!-- 内容标题 -->
                  <div
                    class="text_box"
                    :style="{
                      left: themeObject.content.contentText.left,
                      top: themeObject.content.contentText.top,
                      width: themeObject.content.contentText.width,
                      height: themeObject.content.contentText.height,
                      color: themeObject.content.color,
                      justifyContent: themeObject.content.contentText.textAlign,
                    }"
                    type="title"
                  >
                    <p class="text_container">{{ item.text }}</p>
                  </div>
                  <!-- 默认布局 -->
                  <div
                    class="content_box"
                    :style="{
                      left: themeObject.content.itemBox.left,
                      top: themeObject.content.itemBox.top,
                      width: themeObject.content.itemBox.width,
                      height: themeObject.content.itemBox.height,
                    }"
                  >
                    <div style="position: relative; width: 100%; height: 100%">
                      <!-- 标题 -->
                      <div
                        class="text_box"
                        :style="{
                          left: (index * 100) / item.content.length + '%',
                          top: themeObject.content.contentItemText.top,
                          width: 100 / item.content.length + '%',
                          height: themeObject.content.contentItemText.height,
                          color: themeObject.content.contentItemText.color,
                          justifyContent:
                            themeObject.content.contentItemText.textAlign,
                        }"
                        type="subTitle"
                        v-for="(contentItem, index) of item.content"
                        :key="index"
                      >
                        <p class="text_container">{{ contentItem.text }}</p>
                      </div>
                      <!-- 内容 -->
                      <div
                        class="text_box"
                        :style="{
                          left: (index * 100) / item.content.length + '%',
                          top: themeObject.content.contentItemSubText.top,
                          width: 100 / item.content.length + '%',
                          height: themeObject.content.contentItemSubText.height,
                          color: themeObject.content.contentItemSubText.color,
                          justifyContent:
                            themeObject.content.contentItemSubText.textAlign,
                        }"
                        type="subText"
                        v-for="(contentItem, index) of item.content"
                        :key="index"
                      >
                        <p class="text_container">{{ contentItem.subText }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 结束页 -->
                <div
                  class="swiper_item_container"
                  v-if="item.type === 'end'"
                  :style="{
                    backgroundImage: `url(${themeObject.end.backImage})`,
                  }"
                >
                  <div
                    class="text_box"
                    :style="{
                      left: themeObject.end.endText.left,
                      top: themeObject.end.endText.top,
                      width: themeObject.end.endText.width,
                      height: themeObject.end.endText.height,
                      color: themeObject.end.endText.color,
                      justifyContent: themeObject.end.endText.textAlign,
                    }"
                    type="title"
                  >
                    <p class="text_container">{{ item.text }}</p>
                  </div>
                  <div
                    class="text_box"
                    :style="{
                      left: themeObject.end.endSubText.left,
                      top: themeObject.end.endSubText.top,
                      width: themeObject.end.endSubText.width,
                      height: themeObject.end.endSubText.height,
                      color: themeObject.end.endSubText.color,
                      justifyContent: themeObject.end.endSubText.textAlign,
                    }"
                    type="subTitle"
                  >
                    <p class="text_container">{{ item.subText }}</p>
                  </div>
                </div>
              </swiper-slide>
            </swiper>
          </div>
        </div>
      </div>

      <div class="right_bottom">
        <el-tabs
          v-model="activeName"
          class="bottom_box"
          @tab-click="handleClick"
        >
          <el-tab-pane label="主题" name="first">
            <div class="theme_item_box">
              <div
                v-for="(item, index) in themeList"
                :key="index"
                class="theme_item"
                :style="{ backgroundImage: `url(${item.backImage})` }"
                @click="changeTheme(item)"
              >
                <div
                  :style="{
                    color: item.title.color,
                    left: item.title.left,
                    top: item.title.top,
                    width: item.title.width,
                    height: item.title.height,
                    justifyContent: item.title.textAlign,
                    lineHeight:item.title.lineHeight+'px',
                    fontSize: item.title.fontSize + 'px',
                  }"
                >
                  标题
                </div>
                <div
                :style="{
                    color: item.subTitle.color,
                    left: item.subTitle.left,
                    top: item.subTitle.top,
                    width: item.subTitle.width,
                    height: item.subTitle.height,
                    justifyContent: item.subTitle.textAlign,
                    lineHeight:item.subTitle.lineHeight+'px',
                    fontSize: item.subTitle.fontSize + 'px',
                  }"
                >副标题</div>
                <div
                :style="{
                    color: item.spaker.color,
                    left: item.spaker.left,
                    top: item.spaker.top,
                    width: item.spaker.width,
                    height: item.spaker.height,
                    justifyContent: item.spaker.textAlign,
                    lineHeight:item.spaker.lineHeight+'px',
                    fontSize: item.spaker.fontSize + 'px',
                  }"
                >演讲者</div>
                <div
                :style="{
                    color: item.time.color,
                    left: item.time.left,
                    top: item.time.top,
                    width: item.time.width,
                    height: item.time.height,
                    justifyContent: item.time.textAlign,
                    lineHeight:item.time.lineHeight+'px',
                    fontSize: item.time.fontSize + 'px',
                  }"
                >时间</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="布局" name="second">布局</el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import {
  onMounted,
  reactive,
  ref,
  watch,
  defineProps,
  defineEmits,
  toRefs,
} from "vue";
import { useMarkdownData } from "@/store/markdownText";
import _, { forEach } from "lodash";
import pptxgen from "pptxgenjs";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { ElMessage } from "element-plus";

const dataStore = useMarkdownData();
let swiperRef = ref(null);
let unfoldList = ref([]);
let markdownTextData = ref([]);
let pptTitie = ref("这是ppt的标题");
let subheading = ref("SUBTITLE HERE");
let speaker = ref("数智风科技");
let logoImageUrl = ref("");
let speakingTime = ref("请输入演讲时间");
const router = useRouter();

let isSubheading = ref(false);
let isSpeaker = ref(false);
let isLogoImageUrl = ref(false);
let isSpeakingTime = ref(false);

const props = defineProps({
  id: String,
});

function changeTitle(event) {
  // pptTitie.value = event.target.innerHTML;
  markdownTextDataCopy[0].title = event.target.innerHTML;
  markdownToPPT();
}

function selectTitle() {
  let text = window.getSelection().toString();
  console.log("text", text);
}

function addContent(event) {
  let target = event.target;
  const type = target.getAttribute("data-type");
  if (type) {
    if (type === "subtitle") {
      isSubheading.value = true;
    }
    if (type === "speaker") {
      isSpeaker.value = true;
    }
    if (type === "logo") {
      isLogoImageUrl.value = true;
    }
    if (type === "time") {
      isSpeakingTime.value = true;
    }
  }
}

function removeContetn(item) {
  if (item === "subtitle") {
    isSubheading.value = false;
    markdownTextDataCopy[0].subTitle = "";
  }
  if (item === "speaker") {
    isSpeaker.value = false;
    markdownTextDataCopy[0].speaker = "";
  }
  if (item === "logo") {
    isLogoImageUrl.value = false;
    logoImageUrl.value = "";
    markdownTextDataCopy[0].logoUrl = "";
  }
  if (item === "time") {
    isSpeakingTime.value = false;
    markdownTextDataCopy[0].speakingTime = "";
  }
  markdownToPPT()
}

function backPage() {
  router.back();
}

function changeSubheading() {
  markdownTextDataCopy[0].subTitle = subheading.value;
  markdownToPPT()

}
function changeSpeaker() {
  markdownTextDataCopy[0].speaker = speaker.value;
  markdownToPPT()
}
function changeSpeakingTime() {
  markdownTextDataCopy[0].speakingTime = speakingTime.value;
  markdownToPPT()
}

function imgUploadSuccess(response, uploadFile, uploadFiles) {
  console.log(response);
  console.log(uploadFile);
  console.log(uploadFiles);
  logoImageUrl.value = URL.createObjectURL(uploadFile.raw);
}
function imgUploadRequest(param) {
  console.log(param);
  const blob = URL.createObjectURL(param.file);
  logoImageUrl.value = blob;
}

let markdownTextDataCopy = [];
//修改界面内容
function editText() {
  let argsArray = [...arguments];
  if (argsArray.length === 2) {
    //二级标题
    console.log(argsArray[0].target.getAttribute("textType"));
    console.log(argsArray[0]);

    markdownTextDataCopy[argsArray[1]].text = argsArray[0].target.innerText;
  } else if (argsArray.length === 3) {
    //三级标题
    if (argsArray[0].target.getAttribute("textType") === "text") {
      markdownTextDataCopy[argsArray[1]].children[argsArray[2]].text =
        argsArray[0].target.innerText;
    } else if (argsArray[0].target.getAttribute("textType") === "subText") {
      markdownTextDataCopy[argsArray[1]].children[argsArray[2]].subText =
        argsArray[0].target.innerText;
    }
  } else if (argsArray.length === 4) {
    //四级标题
    if (argsArray[0].target.getAttribute("textType") === "text") {
      markdownTextDataCopy[argsArray[1]].children[argsArray[2]].children[
        argsArray[3]
      ].text = argsArray[0].target.innerText;
    } else if (argsArray[0].target.getAttribute("textType") === "subText") {
      markdownTextDataCopy[argsArray[1]].children[argsArray[2]].children[
        argsArray[3]
      ].subText = argsArray[0].target.innerText;
    }
  } else if (argsArray.length === 5) {
    //五级标题
    if (argsArray[0].target.getAttribute("textType") === "text") {
      markdownTextDataCopy[argsArray[1]].children[argsArray[2]].children[
        argsArray[3]
      ].children[argsArray[4]].text = argsArray[0].target.innerText;
    } else if (argsArray[0].target.getAttribute("textType") === "subText") {
      markdownTextDataCopy[argsArray[1]].children[argsArray[2]].children[
        argsArray[3]
      ].children[argsArray[4]].subText = argsArray[0].target.innerText;
    }
  } else if (argsArray.length === 6) {
    //六级标题
    if (argsArray[0].target.getAttribute("textType") === "text") {
      markdownTextDataCopy[argsArray[1]].children[argsArray[2]].children[
        argsArray[3]
      ].children[argsArray[4]].children[argsArray[5]].text =
        argsArray[0].target.innerText;
    } else if (argsArray[0].target.getAttribute("textType") === "subText") {
      markdownTextDataCopy[argsArray[1]].children[argsArray[2]].children[
        argsArray[3]
      ].children[argsArray[4]].children[argsArray[5]].subText =
        argsArray[0].target.innerText;
    }
  }

  //修改ppt数据
  setTimeout(() => {
    markdownToPPT();
  });
}

//不展开列表中是否包含这一项数据
function isItemInArray(item) {
  return unfoldList.value.includes(item);
}

function removeOnunfold(item) {
  unfoldList.value = unfoldList.value.filter((item1) => item1 !== item);
}
function addOnunfold(item) {
  if (!unfoldList.value.includes(item)) {
    unfoldList.value.push(item);
  }
}

// 添加当前节点
function addMarkdownTextData() {
  let argsArray = [...arguments];
  if (argsArray.length === 1) {
    //添加二级标题
    let item = {
      text: "新标题",
      children: [],
    };
    markdownTextData.value.splice(argsArray[0] + 1, 0, item);
    markdownTextDataCopy.splice(argsArray[0] + 1, 0, item);
    
  } else if (argsArray.length === 2) {
    //添加三级标题
    let item = {
      text: "新标题",
      subText: "标题内容",
      children: [],
    };
    markdownTextData.value[argsArray[0]].children.splice(
      argsArray[1] + 1,
      0,
      item
    );

    markdownTextDataCopy[argsArray[0]].children.splice(
      argsArray[1] + 1,
      0,
      item
    );
    
  } else if (argsArray.length === 3) {
    //添加四级标题
    let item = {
      text: "新标题",
      subText: "标题内容",
      children: [],
    };
    markdownTextData.value[argsArray[0]].children[argsArray[1]].children.splice(
      argsArray[2] + 1,
      0,
      item
    );
    markdownTextDataCopy[argsArray[0]].children[argsArray[1]].children.splice(
      argsArray[2] + 1,
      0,
      item
    );
  } else if (argsArray.length === 4) {
    //添加五级标题
    let item = {
      text: "新标题",
      subText: "标题内容",
      children: [],
    };
    markdownTextData.value[argsArray[0]].children[argsArray[1]].children[
      argsArray[2]
    ].children.splice(argsArray[3] + 1, 0, item);
    markdownTextDataCopy[argsArray[0]].children[argsArray[1]].children[
      argsArray[2]
    ].children.splice(argsArray[3] + 1, 0, item);
  } else if (argsArray.length === 5) {
    //添加六级标题
  }
  markdownToPPT();
}

//添加子节点
function addMarkdownChildrenText() {
  let argsArray = [...arguments];
  if (argsArray.length === 1) {
    //二级标题
    let item = {
      text: "新标题",
      subText: "标题内容",
      children: [],
    };
    markdownTextData.value[argsArray[0]].children.unshift(item);
    markdownTextDataCopy[argsArray[0]].children.unshift(item);
  } else if (argsArray.length === 2) {
    //三级标题
    let item = {
      text: "新标题",
      subText: "标题内容",
      children: [],
    };
    markdownTextData.value[argsArray[0]].children[
      argsArray[1]
    ].children.unshift(item);
    markdownTextDataCopy[argsArray[0]].children[argsArray[1]].children.unshift(
      item
    );
  } else if (argsArray.length === 3) {
    //四级标题
    let item = {
      text: "新标题",
      subText: "标题内容",
      children: [],
    };
    markdownTextData.value[argsArray[0]].children[argsArray[1]].children[
      argsArray[2]
    ].children.unshift(item);
    markdownTextDataCopy[argsArray[0]].children[argsArray[1]].children[
      argsArray[2]
    ].children.unshift(item);
  } else if (argsArray.length === 4) {
    //五级标题
    let item = {
      text: "新标题",
      subText: "标题内容",
      children: [],
    };
    markdownTextData.value[argsArray[0]].children[argsArray[1]].children[
      argsArray[2]
    ].children[argsArray[3]].children.unshift(item);
    markdownTextDataCopy[argsArray[0]].children[argsArray[1]].children[
      argsArray[2]
    ].children[argsArray[3]].children.unshift(item);
  } else if (argsArray.length === 5) {
    //六级标题
  }
  markdownToPPT();
}

//删除节点
function deleteMarkdownText() {
  let argsArray = [...arguments];
  if (argsArray.length === 1) {
    //二级标题
    markdownTextData.value.splice(argsArray[0], 1);
    markdownTextDataCopy.splice(argsArray[0], 1);
  } else if (argsArray.length === 2) {
    //三级标题
    markdownTextData.value[argsArray[0]].children.splice(argsArray[1], 1);
    markdownTextDataCopy[argsArray[0]].children.splice(argsArray[1], 1);
  } else if (argsArray.length === 3) {
    //四级标题
    markdownTextData.value[argsArray[0]].children[argsArray[1]].children.splice(
      argsArray[2],
      1
    );
    markdownTextDataCopy[argsArray[0]].children[argsArray[1]].children.splice(
      argsArray[2],
      1
    );
  } else if (argsArray.length === 4) {
    //五级标题
    markdownTextData.value[argsArray[0]].children[argsArray[1]].children[
      argsArray[2]
    ].children.splice(argsArray[3], 1);
    markdownTextDataCopy[argsArray[0]].children[argsArray[1]].children[
      argsArray[2]
    ].children.splice(argsArray[3], 1);
  } else if (argsArray.length === 5) {
    //六级标题
  }
  markdownToPPT();
}

//向上添加节点
function addUpMarkdownTextData() {
  let argsArray = [...arguments];
  if (argsArray.length === 1) {
    //添加二级标题
    let item = {
      text: "新标题",
      children: [],
    };
    markdownTextData.value.splice(argsArray[0], 0, item);
    markdownTextDataCopy.splice(argsArray[0], 0, item);
  } else if (argsArray.length === 2) {
    //添加三级标题
    let item = {
      text: "新标题",
      subText: "标题内容",
      children: [],
    };
    markdownTextData.value[argsArray[0]].children.splice(argsArray[1], 0, item);
    markdownTextDataCopy[argsArray[0]].children.splice(argsArray[1], 0, item);
  } else if (argsArray.length === 3) {
    //添加四级标题

    let item = {
      text: "新标题",
      subText: "标题内容",
      children: [],
    };
    markdownTextData.value[argsArray[0]].children[argsArray[1]].children.splice(
      argsArray[2],
      0,
      item
    );
    markdownTextDataCopy[argsArray[0]].children[argsArray[1]].children.splice(
      argsArray[2],
      0,
      item
    );
  } else if (argsArray.length === 4) {
    //添加五级标题
    let item = {
      text: "新标题",
      subText: "标题内容",
      children: [],
    };
    markdownTextData.value[argsArray[0]].children[argsArray[1]].children[
      argsArray[2]
    ].children.splice(argsArray[3], 0, item);
    markdownTextDataCopy[argsArray[0]].children[argsArray[1]].children[
      argsArray[2]
    ].children.splice(argsArray[3], 0, item);
  } else if (argsArray.length === 5) {
    //添加六级标题
  }
  markdownToPPT();
}

function initData() {
  markdownTextData.value = _.cloneDeep(dataStore.markdownData);
  markdownTextDataCopy = _.cloneDeep(dataStore.markdownData);
  console.log('markdownTextDataCopy',markdownTextDataCopy);
  
  pptTitie.value = markdownTextData.value[0].title;
  subheading.value = markdownTextData.value[0].subTitle;
  speaker.value = markdownTextData.value[0].speaker;
  speakingTime.value = markdownTextData.value[0].speakingTime;
  logoImageUrl.value = markdownTextData.value[0].logoUrl;
}

function adjustFontSize() {
  let textDom = document.querySelectorAll(".text_box");
  // 获取所有文本元素
  for (let element of textDom) {
    const computedStyle = window.getComputedStyle(element);
    let maxWidth = computedStyle.width;
    let maxHeight = computedStyle.height;

    // 去掉px并转换为浮点数
    maxWidth = parseFloat(maxWidth.replace("px", ""));
    maxHeight = parseFloat(maxHeight.replace("px", ""));
    //当前字体大小
    element.style.fontSize = "50px";
    element.style.lineHeight = "75px";
    //获取当前div高度
    let currentHeight = element.children[0].offsetHeight;
    let curentFontSize = parseFloat(getComputedStyle(element).fontSize);
    while (currentHeight > maxHeight) {
      curentFontSize--;
      element.style.fontSize = `${curentFontSize}px`;
      element.style.lineHeight = `${curentFontSize * 1.5}px`;
      currentHeight = element.children[0].offsetHeight;
      if (curentFontSize <= 5) break;
    }
  }
}

let pptDataList = ref([]);

watch(pptDataList, () => {
  let timer = setTimeout(() => {
    adjustFontSize(); // 当文本内容变化时调整字体大小
    swiperRef.value.update(); // 强制更新 Swiper
    clearTimeout(timer);
  });
});

//markdown数据转ppt数据
function markdownToPPT() {
  // pptDataList.value = []
  let pptDataListCopy = [];
  markdownTextDataCopy.forEach((item, index) => {
    if (index === 0) {
      //封面页
      let item2 = {
        type: "start",
        ...item,
      };
      item2.subTitle = item.subTitle;
      item2.speaker = item.speaker;
      item2.speakingTime = item.speakingTime;
      pptDataListCopy.push(item2);
    } else {
      if (!pptDataListCopy[1]) {
        pptDataListCopy[1] = {
          type: "catalogue",
          content: [],
        };
      }
      pptDataListCopy[1].content.push(item.text);

      pptDataListCopy.push({
        type: "transition",
        text: index < 10 ? "0" + index : index,
        subText: item.text,
      });
      let currentIndex;
      for (let i = 0; i < item.children.length; i++) {
        //三级内容
        if (i === 0) {
          pptDataListCopy.push({
            type: "content",
            text: item.text,
            content: [],
          });
          currentIndex = pptDataListCopy.length - 1;
        }

        pptDataListCopy[currentIndex].content.push({
          text: item.children[i].text,
          subText: item.children[i].subText,
        });
        let currentIndex2;
        for (let j = 0; j < item.children[i].children.length; j++) {
          //四级内容
          if (j === 0) {
            pptDataListCopy.push({
              type: "content",
              text: item.children[i].text,
              content: [],
            });
            currentIndex2 = pptDataListCopy.length - 1;
          }
          pptDataListCopy[currentIndex2].content.push({
            text: item.children[i].children[j].text,
            subText: item.children[i].children[j].subText,
          });
          let currentIndex3;
          for (
            let k = 0;
            k < item.children[i].children[j].children.length;
            k++
          ) {
            //五级内容
            if (k === 0) {
              pptDataListCopy.push({
                type: "content",
                text: item.children[i].children[j].text,
                content: [],
              });
              currentIndex3 = pptDataListCopy.length - 1;
            }
            pptDataListCopy[currentIndex3].content.push({
              text: item.children[i].children[j].children[k].text,
              subText: item.children[i].children[j].children[k].subText,
            });
          }
        }
      }
    }
  });

  // 添加结束页面
  pptDataListCopy.push({
    type: "end",
    text: "THE END",
    subText: "THANKS",
  });
  console.log(pptDataListCopy);

  pptDataList.value = _.cloneDeep(pptDataListCopy);
}

const modules = [Navigation, Pagination, Scrollbar, A11y];
const onSwiper = (swiper) => {
  console.log(swiper);
  swiperRef.value = swiper;
};
const onSlideChange = () => {
  console.log("slide change");
};

// 主题配置
let themeObject = ref({
  // 首页
  cover: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "微软雅黑",
    backImage: "/pptTheme/defalt/cover.jpg",
    title: {
      width: "56%",
      height: "34%",
      left: "4%",
      top: "17%",
      fontSize: 50,
      lineHeight: 75,
      color: "#ffffff",
    },
    subTitle: {
      width: "35%",
      height: "9%",
      left: "6%",
      top: "57.5%",
      fontSize: 20,
      lineHeight: 30,
      color: "#ffffff",
    },
    spaker: {
      width: "28%",
      height: "9%",
      left: "4%",
      top: "86%",
      fontSize: 18,
      lineHeight: 27,
      color: "#ffffff",
    },
    time: {
      width: "28%",
      height: "8%",
      left: "70%",
      top: "86%",
      fontSize: 50,
      lineHeight: 75,
      color: "#ffffff",
    },
  },
  // 目录
  catalogue: {
    backImage: "/pptTheme/defalt/catalogue.jpg",
    color: "#000000",
    textAlign: "left",
    catalogueText: {
      width: "56%",
      height: "17%",
      left: "5%",
      top: "5%",
      fontSize: 38,
      lineHeight: 57,
      color: "#000000",
    },
    itemBox: {
      width: "60%",
      height: "72%",
      left: "5%",
      top: "22%",
    },
    catalogueItem: {
      maxHeight: 11,
      direction: "tb", //表示从上到下排列
      fontSize: 16,
      lineHeight: 24,
      color: "#000000",
    },
  },
  //过渡
  transition: {
    backImage: "/pptTheme/defalt/transition.jpg",
    color: "#ffffff",
    textAlign: "center",
    transitionText: {
      width: "11%",
      height: "22%",
      left: "27%",
      top: "24%",
      fontSize: 49,
      lineHeight: 73.5,
      color: "#ffffff",
    },
    transitionSubText: {
      width: "35%",
      height: "13%",
      left: "15%",
      top: "51%",
      fontSize: 29,
      lineHeight: 43.5,
      color: "#ffffff",
    },
  },
  // 内容
  content: {
    backImage: "/pptTheme/defalt/content.jpg",
    color: "#000000",
    textAlign: "center",
    contentText: {
      left: "5%",
      top: "5%",
      width: "56%",
      height: "15%",
      fontSize: 32,
      lineHeight: 48,
      color: "#000000",
      textAlign: "left",
    },
    contentItemText: {
      top: "10%",
      height: "12%",
      fontSize: 18,
      lineHeight: 27,
      color: "#000000",
      textAlign: "center",
    },
    contentItemSubText: {
      top: "22%",
      height: "22%",
      fontSize: 14,
      lineHeight: 21,
      color: "#000000",
      textAlign: "center",
    },
    itemBox: {
      left: "10%",
      top: "22%",
      width: "80%",
      height: "70%",
      direction: "lr", //表示从左到右排列
    },
  },
  // 结束
  end: {
    backImage: "/pptTheme/defalt/end.jpg",
    color: "#ffffff",
    textAlign: "center",
    endText: {
      left: "15%",
      top: "38%",
      width: "18%",
      height: "10%",
      fontSize: 22,
      lineHeight: 33,
      color: "#ffffff",
      textAlign: "center",
    },
    endSubText: {
      left: "7%",
      top: "49%",
      width: "37%",
      height: "20%",
      fontSize: 45,
      lineHeight: 67.5,
      color: "#ffffff",
      textAlign: "center",
    },
  },
});

let themeList = ref([
  {
    name: "默认",
    theme: "default",
    backImage: "/pptTheme/defalt/cover.jpg",
    title: {
      width: "56%",
      height: "34%",
      left: "4%",
      top: "17%",
      fontSize: 10,
      lineHeight: 15,
      color: "#ffffff",
      textAlign:'left',
    },
    subTitle: {
      width: "35%",
      height: "9%",
      left: "6%",
      top: "57.5%",
      fontSize: 6,
      lineHeight: 9,
      color: "#ffffff",
      textAlign:'center',
    },
    spaker: {
      width: "28%",
      height: "9%",
      left: "4%",
      top: "86%",
      fontSize: 4,
      lineHeight: 6,
      color: "#ffffff",
      textAlign:'center',
    },
    time: {
      width: "28%",
      height: "8%",
      left: "70%",
      top: "86%",
      fontSize: 4,
      lineHeight: 6,
      color: "#ffffff",
      textAlign:'center',
    },
  },
]);

function rgbToHex(rgb) {
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
}

//下载ppt
function downloadPPT() {
  console.log("当前页数", swiperRef.value.slides.length);
  pptdataToPptxgendata();
}

//ppt数据转化为pptxgen数据
function pptdataToPptxgendata() {
  console.log("pptDataList.value", pptDataList.value);
  let boxDom = document.querySelectorAll(".right_content");
  boxDom = boxDom[0];
  let boxHeight = boxDom.getBoundingClientRect().height;
  let boxWidth = boxDom.getBoundingClientRect().width;
  let boxLeft = boxDom.getBoundingClientRect().left;
  let boxTop = boxDom.getBoundingClientRect().top;

  // 设备的 DPI
  let deviceDPI = 96;
  let scale = ((5.625 * deviceDPI) / boxHeight) * 0.6;

  let pres = new pptxgen(); // 创建一个新的ppt
  // pres.defineLayout({
  //   // 定义一个新的布局
  //   name: "A3", // 布局名称
  //   width: boxWidth / 96, // 布局宽度
  //   height: boxHeight / 96, // 布局高度
  // });
  pres.layout = "LAYOUT_16x9"; // 设置布局
  let i = -1;
  for (let item of pptDataList.value) {
    i++;
    let slide = pres.addSlide(); // 添加幻灯片
    if (item.type == "start") {
      // 获取当前页面容器dom
      let parentNode = document.querySelector('[currentIndex="0"]');
      // 获取标题dom
      let titleDom = parentNode.querySelector('div[type="title"]');
      let speakingTimeDom = parentNode.querySelector(
        'div[type="speakingTime"]'
      );
      let speakerDom = parentNode.querySelector('div[type="speaker"]');
      let subTitleDom = parentNode.querySelector('div[type="subTitle"]');
      // 获取字体大小
      // let computedStyle = window.getComputedStyle(titleDom);
      let titleFontSize = parseFloat(
        window.getComputedStyle(titleDom).fontSize.replace("px", "").trim()
      );
      let subTitleFontSize = parseFloat(
        window.getComputedStyle(subTitleDom).fontSize.replace("px", "").trim()
      );
      let speakingTimeFontSize = parseFloat(
        window
          .getComputedStyle(speakingTimeDom)
          .fontSize.replace("px", "")
          .trim()
      );
      let speakerFontSize = parseFloat(
        window.getComputedStyle(speakerDom).fontSize.replace("px", "").trim()
      );
      slide.background = { path: themeObject.value.cover.backImage }; // 设置背景图片
      let optionsTitle = {
        x: themeObject.value.cover.title.left, //相对于页面的位置
        y: themeObject.value.cover.title.top, //相对于页面的位置
        h: themeObject.value.cover.title.height, //相对于页面的高度
        w: themeObject.value.cover.title.width, //元素宽度
        isTextBox: true, //是否为文本框
        // fill: { color:themeObject.value.cover.title. },  //文本框填充颜色
        color: themeObject.value.cover.title.color.replace("#", "").trim(), //文本颜色
        align: themeObject.value.cover.textAlign, //文本对齐方式
        fontSize: titleFontSize * scale, //字体大小
        fontFace: "微软雅黑", //字体
        bold: true, //是否加粗
      };
      let optionsSubTitle = {
        x: themeObject.value.cover.subTitle.left, //相对于页面的位置
        y: themeObject.value.cover.subTitle.top, //相对于页面的位置
        h: themeObject.value.cover.subTitle.height, //相对于页面的高度
        w: themeObject.value.cover.subTitle.width, //元素宽度
        isTextBox: true, //是否为文本框
        // fill: { color:themeObject.value.cover.title. },  //文本框填充颜色
        color: themeObject.value.cover.subTitle.color.replace("#", "").trim(), //文本颜色
        align: themeObject.value.cover.textAlign, //文本对齐方式
        fontSize: subTitleFontSize * scale, //字体大小
        fontFace: "微软雅黑", //字体
        bold: true, //是否加粗
      };
      let optionsSpeakingTime = {
        x: themeObject.value.cover.time.left, //相对于页面的位置
        y: themeObject.value.cover.time.top, //相对于页面的位置
        h: themeObject.value.cover.time.height, //相对于页面的高度
        w: themeObject.value.cover.time.width, //元素宽度
        isTextBox: true, //是否为文本框
        // fill: { color:themeObject.value.cover.time. },  //文本框填充颜色
        color: themeObject.value.cover.time.color.replace("#", "").trim(), //文本颜色
        align: themeObject.value.cover.textAlign, //文本对齐方式
        fontSize: speakingTimeFontSize * scale, //字体大小
        fontFace: "微软雅黑", //字体
        bold: true, //是否加粗
      };
      let optionsSpeaker = {
        x: themeObject.value.cover.spaker.left, //相对于页面的位置
        y: themeObject.value.cover.spaker.top, //相对于页面的位置
        h: themeObject.value.cover.spaker.height, //相对于页面的高度
        w: themeObject.value.cover.spaker.width, //元素宽度
        isTextBox: true, //是否为文本框
        // fill: { color:themeObject.value.cover.spaker. },  //文本框填充颜色
        color: themeObject.value.cover.spaker.color.replace("#", "").trim(), //文本颜色
        align: themeObject.value.cover.textAlign, //文本对齐方式
        fontSize: speakerFontSize * scale, //字体大小
        fontFace: "微软雅黑", //字体
        bold: true, //是否加粗
      };

      slide.addText(item.title, optionsTitle);
      slide.addText(item.subTitle, optionsSubTitle);
      slide.addText(item.speakingTime, optionsSpeakingTime);
      slide.addText(item.speaker, optionsSpeaker);
    } else if (item.type == "catalogue") {
      // 获取当前页面容器dom
      let parentNode = document.querySelector('[currentIndex="1"]');
      // 获取标题dom
      let titleDom = parentNode.querySelector('div[type="title"]');
      let itemDom = parentNode.querySelector('div[type="item"]');
      console.log("titleDom", titleDom);
      console.log("itemDom", itemDom);

      // 获取字体大小
      // let computedStyle = window.getComputedStyle(titleDom);
      let titleFontSize = parseFloat(
        window.getComputedStyle(titleDom).fontSize.replace("px", "").trim()
      );
      let itemFontSize = parseFloat(
        window.getComputedStyle(itemDom).fontSize.replace("px", "").trim()
      );
      console.log("titleFontSize", titleFontSize);
      console.log("itemFontSize", itemFontSize);

      slide.background = { path: themeObject.value.catalogue.backImage }; // 设置背景图片
      let optionsTitle = {
        x: themeObject.value.catalogue.catalogueText.left, //相对于页面的位置
        y: themeObject.value.catalogue.catalogueText.top, //相对于页面的位置
        h: themeObject.value.catalogue.catalogueText.height, //相对于页面的高度
        w: themeObject.value.catalogue.catalogueText.width, //元素宽度
        isTextBox: true, //是否为文本框
        // fill: { color:themeObject.value.cover.title. },  //文本框填充颜色
        color: themeObject.value.catalogue.catalogueText.color
          .replace("#", "")
          .trim(), //文本颜色
        align: themeObject.value.catalogue.textAlign, //文本对齐方式
        fontSize: titleFontSize * scale, //字体大小
        fontFace: "微软雅黑", //字体
        bold: true, //是否加粗
      };
      //添加标题
      slide.addText("CONTENTS", optionsTitle);
      let h =
        100 / item.content.length >
        themeObject.value.catalogue.catalogueItem.maxHeight
          ? themeObject.value.catalogue.catalogueItem.maxHeight
          : 100 / item.content.length;
      h =
        (h / 100) *
        parseFloat(
          themeObject.value.catalogue.itemBox.height.replace("%", "").trim()
        );
      let gap =
        0.01 *
        parseFloat(
          themeObject.value.catalogue.itemBox.height.replace("%", "").trim()
        );
      let j = 0;
      for (let item1 of item.content) {
        let optionsSubTitle = {
          x: themeObject.value.catalogue.itemBox.left, //相对于页面的位置
          y: "0%", //相对于页面的位置
          h: h - gap + "%", //相对于页面的高度
          w: themeObject.value.catalogue.itemBox.width, //元素宽度
          isTextBox: true, //是否为文本框
          // fill: { color:themeObject.value.cover.title. },  //文本框填充颜色
          color: themeObject.value.catalogue.catalogueItem.color
            .replace("#", "")
            .trim(), //文本颜色
          align: themeObject.value.catalogue.textAlign, //文本对齐方式
          fontSize: itemFontSize * scale, //字体大小
          fontFace: "微软雅黑", //字体
          bold: false, //是否加粗
        };
        optionsSubTitle.y =
          j * h +
          parseFloat(
            themeObject.value.catalogue.itemBox.top.replace("%", "").trim()
          ) +
          "%";
        slide.addText(item1, optionsSubTitle);
        j++;
      }
    } else if (item.type == "transition") {
      // 获取当前页面容器dom
      let parentNode = document.querySelector(`[currentIndex="${i}"]`);
      // 获取标题dom
      let titleDom = parentNode.querySelector('div[type="text"]');
      let subDom = parentNode.querySelector('div[type="subText"]');
      // 获取字体大小
      // let computedStyle = window.getComputedStyle(titleDom);
      let titleFontSize = parseFloat(
        window.getComputedStyle(titleDom).fontSize.replace("px", "").trim()
      );
      let subTitleFontSize = parseFloat(
        window.getComputedStyle(subDom).fontSize.replace("px", "").trim()
      );
      slide.background = { path: themeObject.value.transition.backImage }; // 设置背景图片
      let optionsText = {
        x: themeObject.value.transition.transitionText.left, //相对于页面的位置
        y: themeObject.value.transition.transitionText.top, //相对于页面的位置
        h: themeObject.value.transition.transitionText.height, //相对于页面的高度
        w: themeObject.value.transition.transitionText.width, //元素宽度
        isTextBox: true, //是否为文本框
        // fill: { color:themeObject.value.cover.title. },  //文本框填充颜色
        color: themeObject.value.transition.transitionText.color
          .replace("#", "")
          .trim(), //文本颜色
        align: themeObject.value.transition.textAlign, //文本对齐方式
        fontSize: titleFontSize * scale, //字体大小
        fontFace: "微软雅黑", //字体
        bold: true, //是否加粗
      };
      let optionsSubText = {
        x: themeObject.value.transition.transitionSubText.left, //相对于页面的位置
        y: themeObject.value.transition.transitionSubText.top, //相对于页面的位置
        h: themeObject.value.transition.transitionSubText.height, //相对于页面的高度
        w: themeObject.value.transition.transitionSubText.width, //元素宽度
        isTextBox: true, //是否为文本框
        // fill: { color:themeObject.value.transition.title. },  //文本框填充颜色
        color: themeObject.value.transition.transitionSubText.color
          .replace("#", "")
          .trim(), //文本颜色
        align: themeObject.value.transition.textAlign, //文本对齐方式
        fontSize: subTitleFontSize * scale, //字体大小
        fontFace: "微软雅黑", //字体
        bold: true, //是否加粗
      };
      slide.addText(item.text, optionsText);
      slide.addText(item.subText, optionsSubText);
    } else if (item.type == "content") {
      slide.background = { path: themeObject.value.content.backImage }; // 设置背景图片
      // 获取当前页面容器dom
      let parentNode = document.querySelector(`[currentIndex="${i}"]`);
      let pStyle = parentNode.getBoundingClientRect();
      // 获取标题dom
      let titleDom = parentNode.querySelector('div[type="title"]');
      let itemTitleDom = parentNode.querySelectorAll('div[type="subTitle"]');
      let itemTextDom = parentNode.querySelectorAll('div[type="subText"]');

      // 获取标题的样式和位置大小信息
      let tStyle = titleDom.getBoundingClientRect();
      let tH = (tStyle.height / pStyle.height) * 100 + "%";
      let tW = (tStyle.width / pStyle.width) * 100 + "%";
      let tFS =
        parseFloat(
          window.getComputedStyle(titleDom).fontSize.replace("px", "").trim()
        ) * scale;
      // let tFF=window.getComputedStyle(titleDom).fontFamily
      let tC = rgbToHex(window.getComputedStyle(titleDom).color);
      let tA = window.getComputedStyle(titleDom).justifyContent;
      let tX = ((tStyle.left - pStyle.left) / pStyle.width) * 100 + "%";
      let tY = ((tStyle.top - pStyle.top) / pStyle.height) * 100 + "%";
      let optionsTitle = {
        x: tX, //相对于页面的位置
        y: tY, //相对于页面的位置
        h: tH, //相对于页面的高度
        w: tW, //元素宽度
        isTextBox: true, //是否为文本框
        // fill: { color:themeObject.value.cover.title. },  //文本框填充颜色
        color: tC.replace("#", "").trim(), //文本颜色
        align: tA, //文本对齐方式
        fontSize: tFS, //字体大小
        fontFace: "微软雅黑", //字体
        bold: true, //是否加粗
      };
      slide.addText(item.text, optionsTitle);

      // 子标题信息
      for (let item1 of itemTitleDom) {
        let iStyle = item1.getBoundingClientRect();
        let iComS = window.getComputedStyle(item1);
        let iH = (iStyle.height / pStyle.height) * 100 + "%";
        let iW = (iStyle.width / pStyle.width) * 100 + "%";
        let iFS = parseFloat(iComS.fontSize.replace("px", "").trim()) * scale;
        // let tFF=window.getComputedStyle(item).fontFamily
        let iC = rgbToHex(iComS.color);
        let iA = iComS.justifyContent;
        let iX = ((iStyle.left - pStyle.left) / pStyle.width) * 100 + "%";
        let iY = ((iStyle.top - pStyle.top) / pStyle.height) * 100 + "%";

        let options = {
          x: iX, //相对于页面的位置
          y: iY, //相对于页面的位置
          h: iH, //相对于页面的高度
          w: iW, //元素宽度
          isTextBox: true, //是否为文本框
          // fill: { color:themeObject.value.cover.title. },  //文本框填充颜色
          color: iC.replace("#", "").trim(), //文本颜色
          align: iA, //文本对齐方式
          fontSize: iFS, //字体大小
          fontFace: "微软雅黑", //字体
          bold: true, //是否加粗
        };
        slide.addText(item1.innerText, options);
      }
      // 子内容信息
      for (let item1 of itemTextDom) {
        let iStyle = item1.getBoundingClientRect();
        let iComS = window.getComputedStyle(item1);
        let iH = (iStyle.height / pStyle.height) * 100 + "%";
        let iW = (iStyle.width / pStyle.width) * 100 + "%";
        let iFS = parseFloat(iComS.fontSize.replace("px", "").trim()) * scale;
        // let tFF=window.getComputedStyle(item).fontFamily
        let iC = rgbToHex(iComS.color);
        let iA = iComS.justifyContent;
        let iX = ((iStyle.left - pStyle.left) / pStyle.width) * 100 + "%";
        let iY = ((iStyle.top - pStyle.top) / pStyle.height) * 100 + "%";

        let options = {
          x: iX, //相对于页面的位置
          y: iY, //相对于页面的位置
          h: iH, //相对于页面的高度
          w: iW, //元素宽度
          isTextBox: true, //是否为文本框
          // fill: { color:themeObject.value.cover.title. },  //文本框填充颜色
          color: iC.replace("#", "").trim(), //文本颜色
          align: iA, //文本对齐方式
          fontSize: iFS, //字体大小
          fontFace: "微软雅黑", //字体
          bold: false, //是否加粗
        };
        slide.addText(item1.innerText, options);
      }
    } else if (item.type == "end") {
      slide.background = { path: themeObject.value.end.backImage }; // 设置背景图片
      // 获取当前页面容器dom
      let parentNode = document.querySelector(`[currentIndex="${i}"]`);
      let pStyle = parentNode.getBoundingClientRect();
      // 获取标题dom
      let titleDom = parentNode.querySelector('div[type="title"]');
      let itemTitleDom = parentNode.querySelector('div[type="subTitle"]');

      // 获取标题的样式和位置大小信息
      let tStyle = titleDom.getBoundingClientRect();
      let tH = (tStyle.height / pStyle.height) * 100 + "%";
      let tW = (tStyle.width / pStyle.width) * 100 + "%";
      let tFS =
        parseFloat(
          window.getComputedStyle(titleDom).fontSize.replace("px", "").trim()
        ) * scale;
      // let tFF=window.getComputedStyle(titleDom).fontFamily
      let tC = rgbToHex(window.getComputedStyle(titleDom).color);
      let tA = window.getComputedStyle(titleDom).justifyContent;
      let tX = ((tStyle.left - pStyle.left) / pStyle.width) * 100 + "%";
      let tY = ((tStyle.top - pStyle.top) / pStyle.height) * 100 + "%";
      let optionsTitle = {
        x: tX, //相对于页面的位置
        y: tY, //相对于页面的位置
        h: tH, //相对于页面的高度
        w: tW, //元素宽度
        isTextBox: true, //是否为文本框
        // fill: { color:themeObject.value.cover.title. },  //文本框填充颜色
        color: tC.replace("#", "").trim(), //文本颜色
        align: tA, //文本对齐方式
        fontSize: tFS, //字体大小
        fontFace: "微软雅黑", //字体
        bold: true, //是否加粗
      };
      slide.addText(item.text, optionsTitle);
      // 获取标题的样式和位置大小信息
      let subStyle = itemTitleDom.getBoundingClientRect();
      let stH = (subStyle.height / pStyle.height) * 100 + "%";
      let stW = (subStyle.width / pStyle.width) * 100 + "%";
      let stFS =
        parseFloat(
          window
            .getComputedStyle(itemTitleDom)
            .fontSize.replace("px", "")
            .trim()
        ) * scale;
      // let tFF=window.getComputedStyle(itemTitleDom).fontFamily
      let stC = rgbToHex(window.getComputedStyle(itemTitleDom).color);
      let stA = window.getComputedStyle(itemTitleDom).justifyContent;
      let stX = ((subStyle.left - pStyle.left) / pStyle.width) * 100 + "%";
      let stY = ((subStyle.top - pStyle.top) / pStyle.height) * 100 + "%";
      let optionsSubTitle = {
        x: stX, //相对于页面的位置
        y: stY, //相对于页面的位置
        h: stH, //相对于页面的高度
        w: stW, //元素宽度
        isTextBox: true, //是否为文本框
        // fill: { color:themeObject.value.cover.title. },  //文本框填充颜色
        color: stC.replace("#", "").trim(), //文本颜色
        align: stA, //文本对齐方式
        fontSize: stFS, //字体大小
        fontFace: "微软雅黑", //字体
        bold: true, //是否加粗
      };
      slide.addText(item.subText, optionsSubTitle);
    }
  }

  pres.writeFile({ fileName: "新建.pptx" }).then(() => {
    ElMessage({
      message: "导出成功！",
      type: "success",
    });
  });
}

const activeName = ref("first");
function handleClick(tab, event) {
  console.log(tab, event);
}


//切换主题
function changeTheme(item){
  console.log(item);
}

//布局
let layout=ref([
  {

  }
])

onMounted(() => {
  console.log(props.id);
  initData();
  markdownToPPT();
  let timer = setTimeout(() => {
    adjustFontSize();
    clearTimeout(timer);
  });

  window.addEventListener("resize", () => {
    // let timer = setTimeout(() => {
    adjustFontSize();
    //   clearTimeout(timer);
    // });
  }); // 监听窗口调整
});




</script>



<style lang="scss" scoped>
.theme_item {
  display: flex;
  font-size: 12px;
  width: 144px;
  flex-direction: column;
  margin: 10px 16px 10px 0;
  cursor: pointer;
  height: 83px;
  border: 1px solid #cfcfcf;
  align-items: center;
  position: relative;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
.theme_item {
  div {
    position: absolute;
    display: flex;
    align-items: center;
  }
}

.theme_item_box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  overflow-x: hidden;
  align-content: flex-start;
}

.right_bottom {
  width: 100%;
  flex: 1;
  overflow: hidden;
  display: flex;
}

.swiper_item_container {
  height: 100%;
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
}

.content_box {
  position: absolute;
}

.flex_left {
  height: 100%;
  background-color: rgba(255, 255, 255, 0);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  text-align: left;
}

.text_box {
  position: absolute;
  font-weight: bold;
  display: flex;
  // justify-content: center;
  align-items: center;
  font-size: 50px;
  line-height: 75px;
}

.text_container {
  text-align: center;
  word-wrap: break-word;
}

.border_style {
  padding-left: 5px;
  border-left: 1px solid rgba(255, 255, 255, 0.7);
}

.icon_mouse {
  cursor: pointer;
  color: white;
}

.title_box {
  // justify-content: center;
  position: relative;
  display: flex;
  margin-left: -26px;
  box-sizing: border-box;
}

.icon_container {
  margin-right: 8px;
  display: flex;
  width: 38px;
  justify-content: flex-end;
  color: white;
  font-size: 16px;
}

.two_title_text {
  color: rgba(255, 255, 255, 1);
}

.two_title_content {
  margin-top: 20px;
  padding-left: 40px;
  margin-bottom: 20px;
}

.three_title_content {
  padding-left: 40px;
  font-size: 14px;
  padding-bottom: 10px;
}

.all_title {
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
  // border: 2px solid black;
}

.all_content {
  min-height: 24px;
  border: none;
  outline: none;
  flex: 1 1 0%;
  word-break: break-word;
  // display: inline-block;
}

.all_subText {
  font-size: 14px;
}

.three_title_subText {
  margin-top: 10px;
}

.upload_logo {
  cursor: pointer;
  max-height: 100px;
  max-width: 200px;
  min-height: 50px;
  outline: 1px solid #5f5d5d;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  position: relative;

  .avatar {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.edit_markdown_container {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #393d4c;

  .edit_markdown_left {
    width: 65%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .left_top {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      background-color: #393d4c;
      border-bottom: 1px solid #2f3343;

      .back_botton {
        margin: auto 0;
        cursor: pointer;
        display: flex;

        align-items: center;
        justify-content: center;

        .back_icon {
          margin-left: 10px;
        }
      }

      .save_text {
        font-size: 16px;
        margin: auto;
        display: flex;
        align-items: center;

        .save_icon {
          margin-right: 5px;
        }
      }

      .operation_button {
        margin-right: 20px;

        .el-tooltip__trigger {
          margin-right: 20px;
          cursor: pointer;
        }
      }
    }

    .left_content {
      padding: 20px 20% 100px;
      flex: 1;
      background-color: #393d4c;
      overflow: hidden auto;

      .ppt_add_content {
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 0.3rem;
        margin-top: 10px;

        .ppt_add_content_item {
          font-size: 1rem;
          color: white;
          margin-right: 20px;
          border: 1px solid white;
          padding: 5px 10px;
          border-radius: 9px;
          cursor: pointer;
        }
      }

      .ppt_title_text_box {
        background-color: #2f3343;
        padding: 10px 15px;
        color: white;
        font-size: 16px;
        margin-top: 10px;
        border-radius: 10px;

        .ppt_title_text_box_item {
          padding: 5px 0px;

          .title_item_span {
            width: 115px;
            display: inline-block;
            user-select: none;
          }

          .title_item_input {
            font-weight: 400;
            line-height: 22px;
            background-color: #2f3343;
            width: 200px;
            border-bottom: 1px dashed rgb(103 94 94);
          }

          .title_item_icon {
            margin-left: 10px;
            cursor: pointer;
          }
        }

        .logochangecon {
          display: flex;
          flex-direction: column;
        }
      }

      .ppt_title {
        padding: 10px;
        font-size: 24px;
        box-sizing: border-box;
        margin-top: 10px;
        max-height: 84px;
        overflow-y: auto;
        position: relative;
      }

      .ppt_title:focus {
        outline: none;
        border: 2px solid black;
      }

      .ppt_title::before {
        content: "请输入演讲标题";
        color: #888;
        position: absolute;
        top: 10px;
        left: 10px;
        pointer-events: none;
        opacity: 0.5;
      }

      .ppt_title[contenteditable="true"]:empty::before {
        content: "请输入演讲标题";
      }

      .ppt_title[contenteditable="true"]:not(:empty)::before {
        content: "";
      }

      .ppt_content_box {
        display: flex;
        flex-direction: column;
        margin-top: 20px;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }

  .edit_markdown_right {
    width: 35%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #2f3343;

    .right_top {
      width: 100%;
      height: 60px;
      background-color: #2f3343;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;

      .updownLoad_PPT {
        position: absolute;
        right: 20px;
        width: 120px;
      }
    }

    .right_content_container {
      width: 100%;
      padding: 5% 0;
      background-color: #0e1430;
    }

    .right_content_box {
      position: relative;
      width: 90%;
      /* 设定宽度为 100% 或根据需要设定 */
      margin-left: 5%;
      padding-bottom: 50.625%;
      /* 16:9 的比例 = 9 / 16 = 0.5625 = 56.25% */
      background-color: #161f46;
      /* 可选，方便查看 */
    }

    .right_content {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;

      .swiper_div {
        width: 100%;
        height: 100%;

        .swiper_item {
          width: 100%;
          height: 100%;

          .test22 {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.upload_logo {
  .el-upload--text {
    width: 100%;
    height: 100%;
  }
}

.bottom_box > .el-tabs__content {
  padding: 0 10px;
  width: 100%;
  flex: 1;
  .el-tab-pane {
    height: 100%;
    width: 100%;
  }
}

.ant-modal ul[aria-hidden="true"] {
  display: none !important;
}

.right_bottom {
  .el-tabs {
    height: 100%;
    width: 98%;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    .el-tabs__header {
      width: 97%;
      margin: 0 auto;
      .el-tabs__nav-wrap::after {
        background-color: unset !important;
      }
    }
  }
}
</style>