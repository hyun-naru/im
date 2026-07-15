/**
 * 자동 스크롤 유틸리티 (jQuery 버전)
 * 
 * 사용법:
 * 1. jQuery 라이브러리를 먼저 포함해야 합니다.
 * 2. 이 스크립트 파일을 HTML에 포함합니다.
 * 3. observerUtil.init()을 호출하여 실행합니다.
 * 
 * 예시:
 * <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
 * <script src="observerUtil.js"></script>
 * <script>
 *     $(function() {
 *         observerUtil.init({
 *             sectionSelector: '.observer-target',
 *             threshold: 0.3,
 *             scrollSpeed: 600
 *         });
 *     });
 * </script>
 */
var observerUtil = (function($, D) {
    'use strict';

    var options = {
        sectionSelector: '.observer-target',
        scrollSpeed: 800,
        threshold: 0.3
    };

    /**
     * 요소가 실제로 보이는지 확인하는 함수
     * display:none이거나 부모가 숨겨진 경우 false 반환
     */
    var isVisible = function($element) {
        if ($element.length === 0) return false;
        
        // display:none 또는 visibility:hidden인지 확인
        if ($element.css('display') === 'none' || $element.css('visibility') === 'hidden') {
            return false;
        }
        
        // 부모 요소들 중에 display:none인 것이 있는지 확인
        var $parents = $element.parents();
        var isParentHidden = false;
        $parents.each(function() {
            if ($(this).css('display') === 'none' || $(this).hasClass('none')) {
                isParentHidden = true;
                return false;
            }
        });
        
        return !isParentHidden;
    };

    /**
     * 섹션 내 모든 보이는 필수 입력이 완료되었는지 검사
     */
    var isSectionComplete = function($section) {
        var allComplete = true;
        var radioGroups = {};

        // 1. 보이는 select 요소만 검사
        $section.find('select').each(function() {
            if (isVisible($(this))) {
                if ($(this).val() === '' || $(this).val() === null) {
                    allComplete = false;
                    return false;
                }
            }
        });

        if (!allComplete) return false;

        // 2. 보이는 text/tel 입력만 검사 (disabled 제외)
        $section.find('input[type="text"], input[type="tel"]').each(function() {
            var $input = $(this);
            if (!$input.prop('disabled') && isVisible($input)) {
                if ($input.val().trim() === '') {
                    allComplete = false;
                    return false;
                }
            }
        });

        if (!allComplete) return false;

        // 3. 보이는 라디오 버튼 그룹만 검사
        $section.find('input[type="radio"]').each(function() {
            var $radio = $(this);
            if (isVisible($radio)) {
                var name = $radio.attr('name');
                if (name && !radioGroups[name]) {
                    radioGroups[name] = false;
                }
            }
        });

        // 각 라디오 그룹이 체크되었는지 확인
        for (var groupName in radioGroups) {
            var $checkedRadio = $section.find('input[name="' + groupName + '"]:checked');
            if ($checkedRadio.length > 0 && isVisible($checkedRadio)) {
                radioGroups[groupName] = true;
            }
        }

        for (var group in radioGroups) {
            if (!radioGroups[group]) {
                allComplete = false;
                break;
            }
        }

        return allComplete;
    };

    /**
     * 다음 섹션으로 부드럽게 스크롤
     */
    var scrollToNextSection = function($currentSection) {
        var $allSections = $(options.sectionSelector);
        var currentIndex = $allSections.index($currentSection);
        var $nextSection = $allSections.eq(currentIndex + 1);
        
        if ($nextSection.length > 0) {
            var $toggleCon = $nextSection.find('.toggle-con');
            if ($toggleCon.length > 0) {
                $toggleCon.show();
                $nextSection.find('.toggle-header').addClass('on');
            }
            
            $('html, body').animate({
                scrollTop: $nextSection.offset().top - 20
            }, options.scrollSpeed);
        }
    };

    /**
     * Intersection Observer 콜백 함수
     */
    var observerCallback = function(entries) {
        $.each(entries, function(index, entry) {
            if (entry.isIntersecting) {
                var $section = $(entry.target);

                if ($section.data('events-attached')) {
                    return;
                }

                $section.find('input, select').on('change input', function() {
                    setTimeout(function() {
                        if (isSectionComplete($section)) {
                            scrollToNextSection($section);
                        }
                    }, 200);
                });

                $section.data('events-attached', true);
            }
        });
    };

    /**
     * 유틸리티 초기화 함수
     */
    var init = function(customOptions) {
        options = $.extend({}, options, customOptions);

        $(document).ready(function() {
            var $sections = $(options.sectionSelector);

            if ($sections.length === 0) {
                if (window.console) {
                    console.warn('[Observer Util] 경고: observer-target 요소를 찾을 수 없습니다.');
                }
                return;
            }

            if (!('IntersectionObserver' in window)) {
                if (window.console) {
                    console.warn('[Observer Util] 경고: IntersectionObserver를 지원하지 않는 브라우저입니다.');
                }
                return;
            }

            var observerOptions = {
                root: null,
                threshold: options.threshold,
                rootMargin: '0px'
            };

            var observer = new IntersectionObserver(observerCallback, observerOptions);
            
            $sections.each(function() {
                observer.observe(this);
            });
        });
    };

    return {
        init: init
    };

})(jQuery, window.Dcore);
