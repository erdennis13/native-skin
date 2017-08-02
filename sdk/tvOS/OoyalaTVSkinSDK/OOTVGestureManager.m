//
//  OOTVGestureManager.m
//  OoyalaTVSkinSDK
//
//  Copyright © 2016 ooyala. All rights reserved.
//

#import "OOTVGestureManager.h"
#import <OoyalaSDK/OOOoyalaPlayer.h>
#import "OOOoyalaTVPlayerViewController.h"
#import "OOOoyalaTVConstants.h"

@interface OOTVGestureManager()<UIGestureRecognizerDelegate> {
  CGPoint lastPanPoint;
  Float64 lastPlayhead;
}

@property (nonatomic, weak) OOOoyalaTVPlayerViewController *controller;

@property (nonatomic, strong) UITapGestureRecognizer *tapForwardGesture;
@property (nonatomic, strong) UITapGestureRecognizer *tapBackwardGesture;
@property (nonatomic, strong) UITapGestureRecognizer *tapPlayPauseGesture;
@property (nonatomic, strong) UIPanGestureRecognizer *panGesture;
@property (nonatomic, strong) UITapGestureRecognizer *tapOptionsGesture;

@end

@implementation OOTVGestureManager

- (instancetype)initWithController:(OOOoyalaTVPlayerViewController *)controller {
  if (self = [super init]) {
    _controller = controller;
  }
  return self;
}

- (void)addGestures {
  self.tapForwardGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(visibleControllerAction:)];
  self.tapForwardGesture.allowedPressTypes = @[@(UIPressTypeRightArrow)];
  self.tapForwardGesture.delegate = self;

  self.tapBackwardGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(seek:)];
  self.tapBackwardGesture.allowedPressTypes = @[@(UIPressTypeLeftArrow)];
  self.tapBackwardGesture.delegate = self;

  self.tapPlayPauseGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(togglePlay:)];
  self.tapPlayPauseGesture.allowedPressTypes = @[@(UIPressTypePlayPause), @(UIPressTypeSelect)];
  self.tapPlayPauseGesture.delegate = self;
    
    self.tapOptionsGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(closedCaptionsSelector:)];
    self.tapOptionsGesture.allowedPressTypes = @[@(UIPressTypeDownArrow)];
    self.tapOptionsGesture.delegate = self;

  self.panGesture = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(onSwipe:)];
  self.panGesture.delegate = self;

  [self.controller.view addGestureRecognizer:self.tapForwardGesture];
  [self.controller.view addGestureRecognizer:self.tapBackwardGesture];
  [self.controller.view addGestureRecognizer:self.tapPlayPauseGesture];
    [self.tapPlayPauseGesture setCancelsTouchesInView:NO];
  [self.controller.view addGestureRecognizer:self.panGesture];
    [self.controller.view addGestureRecognizer:self.tapOptionsGesture];
}

- (void)removeGestures {
  [self.controller.view removeGestureRecognizer:self.tapForwardGesture];
  [self.controller.view removeGestureRecognizer:self.tapBackwardGesture];
  [self.controller.view removeGestureRecognizer:self.tapPlayPauseGesture];
  [self.controller.view removeGestureRecognizer:self.panGesture];
    [self.controller.view addGestureRecognizer:self.tapOptionsGesture];
}

#pragma mark Gesture Delegates
- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer {
  if (gestureRecognizer == self.tapPlayPauseGesture) {
    return NO;
  }
  return YES;
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldRequireFailureOfGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer {
  if ((gestureRecognizer == self.panGesture) && (otherGestureRecognizer == self.tapPlayPauseGesture)) {
    return YES;
  }

  return NO;
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldBeRequiredToFailByGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer {
  if ((gestureRecognizer == self.tapPlayPauseGesture) && (otherGestureRecognizer == self.panGesture)) {
    return YES;
  }

  return NO;
}

- (BOOL)gestureRecognizerShouldBegin:(UIGestureRecognizer *)gestureRecognizer {
  if ((gestureRecognizer == self.panGesture) && self.controller.player.isPlaying) {
    return NO;
  }
  return YES;
}

- (void)seek:(UITapGestureRecognizer *)sender {

  NSTimeInterval seekTo = self.controller.player.playheadTime;
  if (sender == self.tapForwardGesture) {
    seekTo += FF_SEEK_STEP;
  } else if (sender == self.tapBackwardGesture) {
    seekTo -= FF_SEEK_STEP;
  }

  if (seekTo < 0) {
    seekTo = 0;
  } else if (seekTo > self.controller.player.duration) {
    seekTo = self.controller.player.duration;
  }

  [self.controller.player seek:seekTo];
  [self.controller showProgressBar];
}

- (void)togglePlay:(id)sender {
  if ([self.controller.player isPlaying]) {
    [self.controller.player pause];
  } else {
    [self.controller.player play];
  }
  [self.controller showProgressBar];
}

- (void)visibleControllerAction:(UITapGestureRecognizer *)sender {
    //We verify if CC menu is displayed, else focus will be directed to player
    if (self.controller.closedCaptionMenuDisplayed){
        if (sender == self.tapForwardGesture) {
            //Calling focus environment to give focus to CC menu elements
            [self.controller setNeedsFocusUpdate];
            [self.controller updateFocusIfNeeded];
        }
    }else if (sender == self.tapPlayPauseGesture) {
        [self togglePlay:sender];
    }else if (sender == self.tapForwardGesture) {
        [self seek:sender];
    }
}

- (void)closedCaptionsSelector: (id)sender {
    //if (self.controller closedCaptionMenuDisplayed){
        
    //} else{
        [self.controller setupClosedCaptionsMenu];
    //}
    
}

- (void)onSwipe:(id)sender {
  if (sender == self.panGesture) {
    CGPoint currentPoint = [self.panGesture translationInView:self.controller.view];
    CGFloat viewWidth = self.controller.view.frame.size.width;
    if (viewWidth == 0) {
      viewWidth = 1920;
    }
    CGFloat seekScale = self.controller.player.duration / viewWidth * SWIPE_TO_SEEK_MULTIPLIER;
    [self.controller showProgressBar];

    switch (self.panGesture.state) {
      case UIGestureRecognizerStateBegan:
        lastPanPoint = currentPoint;
        lastPlayhead = self.controller.player.playheadTime;
        break;
      case UIGestureRecognizerStateChanged: {
        CGFloat distance = currentPoint.x - lastPanPoint.x;
        if (abs(distance) > SWIPE_TO_SEEK_MIN_THRESHOLD) {
          lastPanPoint = currentPoint;
          lastPlayhead += distance * seekScale;
          [self.controller.player seek:lastPlayhead];
        }
        break;
      }
      case UIGestureRecognizerStateEnded:
        break;
      default:
        break;
    }
  }
}


@end
